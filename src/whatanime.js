import _ from 'lodash';
import AwaitLock from 'await-lock';
import CQ from './CQcode';
import logError from './logError';
const Axios = require('./axiosProxy');

let hostsI = 0;

const date2str = ({ year, month, day }) => [year, month, day].join('-');

/**
 * whatanime搜索
 *
 * @param {string} imgURL
 * @param {boolean} [debug=false]
 * @returns
 */
async function doSearch(imgURL, debug = false) {
  const hosts = global.config.whatanimeHost;
  const tokens = global.config.whatanimeToken;
  const index = hostsI++;
  const hostIndex = index % hosts.length; // 决定当前使用的host
  const tokenIndex = index % tokens.length;
  let msg = global.config.bot.replys.failed; // 返回信息
  const msgs = [];
  let success = false;

  function appendMsg(str, needEsc = true) {
    if (typeof str === 'string' && str.length > 0) msg += '\n' + (needEsc ? CQ.escape(str) : str);
  }

  await getSearchResult(hosts[hostIndex], tokens[tokenIndex] || undefined, imgURL)
    .then(async ret => {
      if (debug) {
        console.log(`${global.getTime()} whatanime[${hostIndex}]`);
        console.log(JSON.stringify(ret.data));
      }

      const errMsg = _.get(ret, 'data.error');
      if (ret.status !== 200 || errMsg) {
        msg = errMsg || ret.data;
        logError(ret);
        return;
      }

      // 提取信息
      const result = _.get(ret, 'data.result[0]'); // 相似度最高的结果
      const similarity = (result.similarity * 100).toFixed(2); // 相似度
      const {
        anilist, // 番剧 ID
        episode = '-', // 集数
        from, // 时间点
        video, // 预览视频
        image, // 预览图片
      } = result;
      const time = (() => {
        const s = Math.floor(from);
        const m = Math.floor(s / 60);
        const ms = [m, s % 60];
        return ms.map(num => String(num).padStart(2, '0')).join(':');
      })();

      await getAnimeInfo(anilist)
        .then(({ type, format, isAdult, title, startDate, endDate, coverImage }) => {
          msg = `WhatAnime (${similarity}%)\n该截图出自第${episode}集的${time}`;
          if (!(global.config.bot.hideImg || (global.config.bot.hideImgWhenWhatanimeR18 && isAdult))) {
            appendMsg(CQ.img(coverImage.large), false);
          }
          const titles = _.uniq(['romaji', 'native', 'chinese'].map(k => title[k]).filter(v => v));
          appendMsg(titles.join('\n'));
          appendMsg(`类型：${type}-${format}`);
          appendMsg(`开播：${date2str(startDate)}`);
          if (endDate.year > 0) appendMsg(`完结：${date2str(endDate)}`);
          if (isAdult) appendMsg('R18注意！');
          if (!isAdult && global.config.bot.whatanimeSendVideo) {
            msgs.push(CQ.video(`${video}&size=l`, `${image}&size=l`), false);
          }
          success = true;
        })
        .catch(e => {
          appendMsg('获取番剧信息失败');
          logError(`${global.getTime()} [error] whatanime getAnimeInfo`);
          logError(e);
        });
    })
    .catch(e => {
      logError(`${global.getTime()} [error] whatanime[${hostIndex}]`);
      logError(e);
    });

  return {
    success,
    msgs: [msg, ...msgs].filter(s => s),
  };
}

const apiLock = new AwaitLock();

/**
 * 取得搜番结果
 *
 * @param {string} host 自定义 whatanime 的 host
 * @param {string} key whatanime token
 * @param {string} url 图片地址
 * @returns Prased JSON
 */
async function getSearchResult(host, key, url) {
  if (host === 'api.trace.moe') host = `https://${host}`;
  else if (!/^https?:\/\//.test(host)) host = `http://${host}`;
  await apiLock.acquireAsync();
  return Axios.get(`${host}/search`, {
    params: {
      url,
      key,
    },
    validateStatus: () => true,
  }).finally(() => apiLock.release());
}

const animeInfoQuery = `
query ($id: Int) {
  Media (id: $id, type: ANIME) {
    id
    type
    format
    isAdult
    title {
      native
      romaji
    }
    startDate {
      year
      month
      day
    }
    endDate {
      year
      month
      day
    }
    coverImage {
      large
    }
  }
}`;

/**
 * 取得番剧信息
 *
 * @param {number} id
 * @returns Prased JSON
 */
function getAnimeInfo(id) {
  return Axios.post('https://trace.moe/anilist/', {
    query: animeInfoQuery,
    variables: { id },
  }).then(({ data }) => data.data.Media);
}

export default doSearch;
