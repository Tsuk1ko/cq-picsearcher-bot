import _ from 'lodash';
import nhentai from './nhentai';
import getSource from './getSource';
import pixivShorten from './urlShorten/pixiv';
import logError from './logError';
import { getCqImg64FromUrl } from './utils/image';
const Axios = require('./axiosProxy');

let hostsI = 0;

const snDB = {
  all: 999,
  pixiv: 5,
  danbooru: 9,
  doujin: 38,
  anime: 21,
};

const exts = {
  j: 'jpg',
  p: 'png',
  g: 'gif',
};

/**
 * saucenao搜索
 *
 * @param {string} imgURL 图片地址
 * @param {string} db 搜索库
 * @param {boolean} [debug=false] 是否调试
 * @returns Promise 返回消息、返回提示
 */
async function doSearch(imgURL, db, debug = false) {
  const hosts = global.config.saucenaoHost;
  const apiKeys = global.config.saucenaoApiKey;
  const index = hostsI++;
  const hostIndex = index % hosts.length; // 决定当前使用的host
  const apiKeyIndex = index % apiKeys.length;

  let warnMsg = ''; // 返回提示
  let msg = global.config.bot.replys.failed; // 返回消息
  let success = false;
  let lowAcc = false;
  let excess = false;

  if (apiKeys[apiKeyIndex]) {
    await getSearchResult(hosts[hostIndex], apiKeys[apiKeyIndex], imgURL, db)
      .then(async ret => {
        const data = ret.data;

        // 如果是调试模式
        if (debug) {
          console.log(`${global.getTime()} saucenao[${hostIndex}] ${hosts[hostIndex]}`);
          console.log(JSON.stringify(data));
        }

        // 确保回应正确
        if (typeof data !== 'object') throw ret;
        if (data.results && data.results.length > 0) {
          data.results.forEach(({ header }) => (header.similarity = parseFloat(header.similarity)));
          if (db === snDB.all && data.results[0].header.index_id !== snDB.pixiv) {
            const firstSim = data.results[0].header.similarity;
            const pixivIndex = data.results.findIndex(
              // 给一点点权重
              ({ header: { similarity, index_id } }) => index_id === snDB.pixiv && similarity * 1.03 >= firstSim
            );
            if (pixivIndex !== -1) {
              const pixivResults = data.results.splice(pixivIndex, 1);
              data.results.unshift(...pixivResults);
            }
          }
          let {
            header: {
              short_remaining, // 短时剩余
              long_remaining, // 长时剩余
              similarity, // 相似度
              thumbnail, // 缩略图
              index_id, // 图库
            },
            data: {
              ext_urls,
              title, // 标题
              member_name, // 作者
              member_id, // 可能 pixiv uid
              eng_name, // 本子名
              jp_name, // 本子名
              source, // 来源
              author, // 作者
              artist, // 作者
            },
          } = data.results[0];
          const simText = similarity.toFixed(2);
          let sourceTitle = null;
          if (!/^https?:\/\//.test(source)) {
            sourceTitle = source;
            source = null;
          }

          let url = ''; // 结果链接
          if (ext_urls) {
            url = ext_urls[0];
            if (index_id === snDB.pixiv) {
              // 如果结果为 pixiv，尝试找到原始投稿，避免返回盗图者的投稿
              const pixivResults = data.results.filter(
                result =>
                  result.header.index_id === snDB.pixiv &&
                  _.get(result, 'data.ext_urls[0]') &&
                  Math.abs(result.header.similarity - similarity) < 5
              );
              if (pixivResults.length > 1) {
                const result = _.minBy(pixivResults, result =>
                  parseInt(result.data.ext_urls[0].match(/\d+/).toString())
                );
                url = result.data.ext_urls[0];
                title = result.data.title;
                member_name = result.data.member_name;
                member_id = result.data.member_id;
                similarity = result.header.similarity;
                thumbnail = result.header.thumbnail;
              }
            } else if (ext_urls.length > 1) {
              // 如果结果有多个，优先取 danbooru
              for (let i = 1; i < ext_urls.length; i++) {
                if (ext_urls[i].indexOf('danbooru') !== -1) url = ext_urls[i];
              }
            }
            url = url.replace('http://', 'https://');
            // 获取来源
            if (!source) source = await getSource(url).catch(() => null);
            if (source && source.includes('i.pximg.net')) {
              source = source.replace(/.*\/(\d+).*?$/, 'https://pixiv.net/i/$1');
            }
          }

          title = title || sourceTitle;
          author = member_name || author || artist;
          if (author && author.length) title = `「${title}」/「${author}」`;

          // 剩余搜图次数
          if (long_remaining < 20) warnMsg += `saucenao-${hostIndex}：注意，24h内搜图次数仅剩${long_remaining}次\n`;
          else if (short_remaining < 5) {
            warnMsg += `saucenao-${hostIndex}：注意，30s内搜图次数仅剩${short_remaining}次\n`;
          }

          // 相似度
          if (similarity < global.config.bot.saucenaoLowAcc) {
            lowAcc = true;
            warnMsg += `相似度 ${simText}% 过低，如果这不是你要找的图，那么可能：确实找不到此图/图为原图的局部图/图清晰度太低/搜索引擎尚未同步新图\n`;
            if (global.config.bot.useAscii2dWhenLowAcc && (db === snDB.all || db === snDB.pixiv))
              warnMsg += '自动使用 ascii2d 进行搜索\n';
          }

          // 回复的消息
          msg = await getShareText({
            url,
            title: [`SauceNAO (${simText}%)`, title].filter(v => v).join('\n'),
            thumbnail:
              global.config.bot.hideImgWhenLowAcc && similarity < global.config.bot.saucenaoLowAcc ? null : thumbnail,
            author_url: member_id && url.indexOf('pixiv.net') >= 0 ? `https://pixiv.net/u/${member_id}` : null,
            source,
          });

          success = true;

          // 如果是本子
          const doujinName = jp_name || eng_name; // 本子名
          if (doujinName) {
            if (global.config.bot.getDojinDetailFromNhentai) {
              const searchName = (eng_name || jp_name).replace('(English)', '').replace(/_/g, '/');
              const doujin = await nhentai(searchName).catch(e => {
                logError(`${global.getTime()} [error] nhentai`);
                logError(e);
                return false;
              });
              // 有本子搜索结果的话
              if (doujin) {
                thumbnail = `https://t.nhentai.net/galleries/${doujin.media_id}/cover.${
                  exts[doujin.images.thumbnail.t]
                }`;
                url = `https://nhentai.net/g/${doujin.id}/`;
              } else {
                if (db === snDB.all) success = false;
                warnMsg += '貌似没有在 nhentai 找到对应的本子 _(:3」∠)_\n';
              }
            }
            msg = await getShareText({
              url,
              title: `(${simText}%) ${doujinName}`,
              thumbnail:
                !(global.config.bot.hideImgWhenLowAcc && similarity < global.config.bot.saucenaoLowAcc) && thumbnail,
            });
          }

          // 处理返回提示
          if (warnMsg.length > 0) warnMsg = warnMsg.trim();
        } else if (data.header.message) {
          const retMsg = data.header.message;
          if (retMsg.startsWith('Specified file no longer exists on the remote server')) {
            msg = '该图片已过期，请尝试二次截图后发送';
          } else if (retMsg.startsWith('Problem with remote server')) {
            msg = `saucenao-${hostIndex} 远程服务器出现问题，请稍后尝试重试`;
          } else {
            logError(data);
            msg = `saucenao-${hostIndex} ${retMsg}`;
          }
        } else {
          logError(`${global.getTime()} [error] saucenao[${hostIndex}][data]`);
          logError(data);
        }
      })
      .catch(e => {
        logError(`${global.getTime()} [error] saucenao[${hostIndex}][request]`);
        if (e.response) {
          if (e.response.status === 429) {
            msg = `saucenao-${hostIndex} 搜索次数已达单位时间上限，请稍候再试`;
            excess = true;
          } else logError(e.response.data);
        } else logError(e);
      });
  } else {
    msg = '未配置 saucenaoApiKey，无法使用 saucenao 搜图';
  }

  return {
    success,
    msg,
    warnMsg,
    lowAcc,
    excess,
  };
}

/**
 * 链接混淆
 *
 * @param {string} url
 * @returns
 */
async function confuseURL(url) {
  return pixivShorten(url);
}

async function getShareText({ url, title, thumbnail, author_url, source }) {
  const texts = [title];
  if (thumbnail && !global.config.bot.hideImg) {
    texts.push(await getCqImg64FromUrl(thumbnail));
  }
  if (url) texts.push(await confuseURL(url));
  if (author_url) texts.push(`Author: ${await confuseURL(author_url)}`);
  if (source) texts.push(`Source: ${await confuseURL(source)}`);
  return texts.join('\n');
}

/**
 * 取得搜图结果
 *
 * @param {string} host 自定义 saucenao 的 host
 * @param {string} api_key saucenao api key
 * @param {string} imgURL 欲搜索的图片链接
 * @param {number} [db=999] 搜索库
 * @returns Axios 对象
 */
function getSearchResult(host, api_key, imgURL, db = 999) {
  if (host === 'saucenao.com') host = `https://${host}`;
  else if (!/^https?:\/\//.test(host)) host = `http://${host}`;
  return Axios.get(`${host}/search.php`, {
    params: {
      ...(api_key ? { api_key } : {}),
      db: db,
      output_type: 2,
      numres: 3,
      url: imgURL,
    },
  });
}

export default doSearch;

export { snDB };
