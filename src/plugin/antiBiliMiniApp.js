import _ from 'lodash';
import { get, head } from 'axios';
import { stringify } from 'qs';
import NodeCache from 'node-cache';
import CQ from '../CQcode';
import logError from '../logError';
import parseJSON from '../utils/parseJSON';

const cache = new NodeCache({ stdTTL: 3 * 60 });

function humanNum(num) {
  return num < 10000 ? num : `${(num / 10000).toFixed(1)}万`;
}

function getVideoInfo(param) {
  return get(`https://api.bilibili.com/x/web-interface/view?${stringify(param)}`)
    .then(
      ({
        data: {
          data: {
            bvid,
            aid,
            pic,
            title,
            owner: { name },
            stat: { view, danmaku },
          },
        },
      }) => `${CQ.img(pic)}
av${aid} = ${bvid}
${title}
UP：${name}
${humanNum(view)}播放 ${humanNum(danmaku)}弹幕
https://www.bilibili.com/video/av${aid}`
    )
    .catch(e => {
      logError(`${global.getTime()} [error] get bilibili video info ${param}`);
      logError(e);
      return null;
    });
}

function getSearchVideoInfo(keyword) {
  return get(`https://api.bilibili.com/x/web-interface/search/all/v2?${stringify({ keyword })}`).then(
    ({
      data: {
        data: { result },
      },
    }) => {
      const videos = result.find(({ result_type: rt }) => rt === 'video').data;
      if (videos.length === 0) return null;
      const { author, aid, bvid, title, pic, play, video_review } = videos[0];
      return `${CQ.img(`http:${pic}`)}
（搜索）av${aid}
${title.replace(/<([^>]+?)[^>]+>(.*?)<\/\1>/g, '$2')}
UP：${author}
${humanNum(play)}播放 ${humanNum(video_review)}弹幕
https://www.bilibili.com/video/${bvid}`;
    }
  );
}

function getDynamicInfo(param) {
  return get(`https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?${stringify(param)}`)
    .then(
      ({
        data: {
          data: {
            card: {
              desc: { view, like,
                dynamic_id,
                user_profile: {
                  info: {uname}
                }
              }
              //card: {
                //item: {
                  //description,
                  //pictures: [{img_src}]
                //}
              //}
            }
          }
        }
      }) => `
${uname}
${humanNum(view)}阅读 ${humanNum(like)}点赞
https://t.bilibili.com/${dynamic_id}`
    )
    .catch(e => {
      logError(`${global.getTime()} [error] get bilibili dynamic info ${param}`);
      logError(e);
      return null;
    });
}

function getArticleInfo(param) {
  return get(`https://api.bilibili.com/x/article/viewinfo?${stringify(param)}`)
    .then(
      ({
        data: {
          data: {
            stats: { view, like },
            title,
            author_name,
            image_urls
          }
        }
      }) => `${CQ.img(image_urls)}
${title}
UP：${author_name}
${humanNum(view)}阅读 ${humanNum(like)}点赞
`
    )
    .catch(e => {
      logError(`${global.getTime()} [error] get bilibili article info ${param}`);
      logError(e);
      return null;
    });
}

function getIDFromNormalLink(link) {
  if (typeof link !== 'string') return null;
  const searchvideo = /bilibili\.com\/video\/(?:[Aa][Vv]([0-9]+)|([Bb][Vv][0-9a-zA-Z]+))/.exec(link);
  const searchdynamic = /t\.bilibili\.com\/(?:([0-9]+))/.exec(link);
  const searcharticle = /bilibili\.com\/read\/(?:[Cc][Vv]([0-9]+))/.exec(link);
  if (searchvideo) return { aid: searchvideo[1], bvid: searchvideo[2], dynamic_id: null, id: null };
  if (searchdynamic) return { aid: null, bvid: null, dynamic_id: searchdynamic[1], id: null };
  if (searcharticle) return { aid: null, bvid: null, dynamic_id: null, id: searcharticle[1] };
  return null
}

function getNormalLinkFromShortLink(shortLink) {
  return head(shortLink, { maxRedirects: 0, validateStatus: status => status >= 200 && status < 400 })
    .then(ret => getIDFromNormalLink(ret.headers.location))
    .catch(e => {
      logError(`${global.getTime()} [error] head request bilibili short link ${shortLink}`);
      logError(e);
      return null;
    });
}

async function getLinkFromMsg(msg) {
  let search;
  if ((search = getIDFromNormalLink(msg))) return search;
  if ((search = /(b23|acg)\.tv\/[0-9a-zA-Z]+/.exec(msg))) return getNormalLinkFromShortLink(`http://${search[0]}`);
  return null;
}

async function antiBiliMiniApp(context) {
  const setting = global.config.bot.antiBiliMiniApp;
  const gid = context.group_id;
  const msg = context.message;
  const data = (() => {
    if (msg.includes('com.tencent.miniapp_01') && msg.includes('哔哩哔哩')) {
      if (setting.despise) {
        global.replyMsg(context, CQ.img('https://i.loli.net/2020/04/27/HegAkGhcr6lbPXv.png'));
      }
      return parseJSON(context.message);
    }
  })();
  const qqdocurl = _.get(data, 'meta.detail_1.qqdocurl');
  const title = _.get(data, 'meta.detail_1.desc');
  if (setting.enableFunction) {
    const param = await getLinkFromMsg(qqdocurl || msg);
    if (param) {
      const { aid, bvid, dynamic_id, id } = param;
      if (gid) {
        const cacheKeys = [`${gid}-${aid}`, `${gid}-${bvid}`, `${gid}-${dynamic_id}`, `${gid}-${id}`];
        if (cacheKeys.some(key => cache.has(key))) return;
        [aid, bvid, dynamic_id, id].forEach((id, i) => id && cache.set(cacheKeys[i], true));
      }
      if (setting.getVideoInfo) {
        if ( aid||bvid !== null) {
          const reply = await getVideoInfo(param);
          if (reply) {
            global.replyMsg(context, reply);
            return;
          }
        }
      }
      if (setting.getDynamicInfo) {
        if ( dynamic_id !== null) {
          const reply = await getDynamicInfo(param);
          if (reply) {
            global.replyMsg(context, reply);
            return;
          }
        }
      }
      if (setting.getArticleInfo) {
        if ( id !== null) {
          const reply = await getArticleInfo(param);
          if (reply) {
            global.replyMsg(context, reply);
            return;
          }
        }
      }
    }
    const isBangumi = /bilibili\.com\/bangumi|(b23|acg)\.tv\/(ep|ss)/.test(qqdocurl || msg);
    if (title && !isBangumi) {
      const reply = await getSearchVideoInfo(title);
      if (reply) {
        global.replyMsg(context, reply);
      }
    }
  }
}

export default antiBiliMiniApp;
