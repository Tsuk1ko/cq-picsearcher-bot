import { get, head } from 'axios';
import { stringify } from 'qs';
import NodeCache from 'node-cache';
import CQ from '../CQcode';
import logError from '../logError';
import config from '../config';

const setting = config.picfinder.antiBiliMiniApp;
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
av${aid}
${title}
UP：${name}
${humanNum(view)}播放 ${humanNum(danmaku)}弹幕
https://www.bilibili.com/video/${bvid}`
    )
    .catch(e => {
      logError(`${new Date().toLocaleString()} [error] get bilibili video info ${param}`);
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

function getAvBvFromNormalLink(link) {
  if (typeof link !== 'string') return null;
  const search = /bilibili\.com\/video\/(?:[Aa][Vv]([0-9]+)|([Bb][Vv][0-9a-zA-Z]+))/.exec(link);
  if (search) return { aid: search[1], bvid: search[2] };
  return null;
}

function getAvBvFromShortLink(shortLink) {
  return head(shortLink, { maxRedirects: 0, validateStatus: status => status >= 200 && status < 400 })
    .then(ret => getAvBvFromNormalLink(ret.headers.location))
    .catch(e => {
      logError(`${new Date().toLocaleString()} [error] head request bilibili short link ${shortLink}`);
      logError(e);
      return null;
    });
}

async function getAvBvFromMsg(msg) {
  let search;
  if ((search = getAvBvFromNormalLink(msg))) return search;
  if ((search = /(b23|acg)\.tv\/[0-9a-zA-Z]+/.exec(msg))) return getAvBvFromShortLink(`http://${search[0]}`);
  return null;
}

async function antiBiliMiniApp(context, replyFunc) {
  const msg = context.message;
  let title = null;
  if (msg.includes('100951776') && msg.includes('哔哩哔哩')) {
    if (setting.despise) {
      replyFunc(context, CQ.img('https://i.loli.net/2020/04/27/HegAkGhcr6lbPXv.png'));
    }
    const search = /"desc":"(.+?)"(?:,|})/.exec(CQ.unescape(msg));
    if (search) title = search[1].replace(/\\"/g, '"');
  }
  if (setting.getVideoInfo) {
    const param = await getAvBvFromMsg(msg);
    if (param) {
      const { aid, bvid } = param;
      if (cache.has(aid) || cache.has(bvid)) return;
      if (aid) cache.set(aid, true);
      if (bvid) cache.set(bvid, true);
      const reply = await getVideoInfo(param);
      if (reply) {
        replyFunc(context, reply);
        return;
      }
    }
    const isBangumi = /bilibili\.com\/bangumi|(b23|acg)\.tv\/(ep|ss)/.test(msg);
    if (title && !isBangumi) {
      const reply = await getSearchVideoInfo(title);
      if (reply) {
        replyFunc(context, reply);
        return;
      }
    }
  }
}

export default antiBiliMiniApp;
