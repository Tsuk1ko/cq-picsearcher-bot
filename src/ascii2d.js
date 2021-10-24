import _ from 'lodash';
import Cheerio from 'cheerio';
import pixivShorten from './urlShorten/pixiv';
import logError from './logError';
import { retryAync } from './utils/retry';
import { getCqImg64FromUrl } from './utils/image';
const Axios = require('./axiosProxy');

let hostsI = 0;

/**
 * ascii2d 搜索
 *
 * @param {string} url 图片地址
 * @returns 色合検索 和 特徴検索 结果
 */
async function doSearch(url, snLowAcc = false) {
  const hosts = global.config.ascii2dHost;
  let host = hosts[hostsI++ % hosts.length];
  if (host === 'ascii2d.net') host = `https://${host}`;
  else if (!/^https?:\/\//.test(host)) host = `http://${host}`;
  const { colorURL, colorDetail } = await retryAync(
    async () => {
      const ret = await Axios.get(`${host}/search/url/${encodeURIComponent(url)}`);
      const colorURL = ret.request.res.responseUrl;
      if (!colorURL.includes('/color/')) {
        const $ = Cheerio.load(ret.data, { decodeEntities: false });
        throw new Error($('.container > .row > div:first-child > p').text().trim());
      }
      return {
        colorURL,
        colorDetail: getDetail(ret, host),
      };
    },
    3,
    e => String(_.get(e, 'response.data')).trim() === 'first byte timeout'
  );
  const bovwURL = colorURL.replace('/color/', '/bovw/');
  const bovwDetail = await Axios.get(bovwURL).then(r => getDetail(r, host));
  const colorRet = await getResult(colorDetail, snLowAcc);
  const bovwRet = await getResult(bovwDetail, snLowAcc);
  return {
    color: `ascii2d 色合検索\n${colorRet.result}`,
    bovw: `ascii2d 特徴検索\n${bovwRet.result}`,
    success: colorRet.success && bovwRet.success,
  };
}

/**
 * 解析 ascii2d 网页结果
 *
 * @param {string} ret ascii2d response
 * @param {string} baseURL ascii2d base URL
 * @returns 画像搜索结果
 */
function getDetail(ret, baseURL) {
  let result = {};
  const html = ret.data;
  const $ = Cheerio.load(html, { decodeEntities: false });
  const $itembox = $('.item-box');
  for (let i = 0; i < $itembox.length; i++) {
    const $box = $($itembox[i]);
    const $link = $box.find('.detail-box a');
    if ($link.length === 0) continue;
    const $title = $($link[0]);
    const $author = $($link[1]);
    result = {
      thumbnail: baseURL + $box.find('.image-box img').attr('src'),
      title: $title.html(),
      author: $author.html(),
      url: $title.attr('href'),
      author_url: $author.attr('href'),
    };
    break;
  }
  if (!result.url) {
    logError(`${global.getTime()} [error] ascii2d getDetail`);
    logError(ret);
  }
  return result;
}

async function getResult({ url, title, author, thumbnail, author_url }, snLowAcc = false) {
  if (!url) return { success: false, result: '由未知错误导致搜索失败' };
  const texts = [`「${title}」/「${author}」`];
  if (thumbnail && !(global.config.bot.hideImg || (snLowAcc && global.config.bot.hideImgWhenLowAcc))) {
    texts.push(await getCqImg64FromUrl(thumbnail));
  }
  texts.push(pixivShorten(url));
  if (author_url) texts.push(`Author: ${pixivShorten(author_url)}`);
  return { success: true, result: texts.join('\n') };
}

export default doSearch;
