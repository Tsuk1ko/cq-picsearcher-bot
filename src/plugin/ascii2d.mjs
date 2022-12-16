import * as Cheerio from 'cheerio';
import FormData from 'form-data';
import _ from 'lodash-es';
import Axios from '../utils/axiosProxy.mjs';
import CQ from '../utils/CQcode.mjs';
import { getCqImg64FromUrl, getAntiShieldedCqImg64FromUrl } from '../utils/image.mjs';
import logError from '../utils/logError.mjs';
import { retryAsync } from '../utils/retry.mjs';
import { confuseURL } from '../utils/url.mjs';

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
  const callApi = global.config.bot.ascii2dUsePuppeteer
    ? callAscii2dUrlApiWithPuppeteer
    : global.config.bot.ascii2dLocalUpload
    ? callAscii2dUploadApi
    : callAscii2dUrlApi;
  const { colorURL, colorDetail } = await retryAsync(
    async () => {
      const ret = await callApi(host, url);
      const colorURL = ret.request.res.responseUrl;
      if (!colorURL.includes('/color/')) {
        const $ = Cheerio.load(ret.data, { decodeEntities: false });
        console.error('[error] ascii2d url:', colorURL);
        if (global.config.bot.debug) console.error(ret.data);
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
  const bovwDetail = await (global.config.bot.ascii2dUsePuppeteer ? getAscii2dWithPuppeteer : Axios.cfGet)(
    bovwURL
  ).then(r => getDetail(r, host));
  const colorRet = await getResult(colorDetail, snLowAcc);
  const bovwRet = await getResult(bovwDetail, snLowAcc);
  return {
    color: `ascii2d 色合検索\n${colorRet.result}`,
    bovw: `ascii2d 特徴検索\n${bovwRet.result}`,
    success: colorRet.success && bovwRet.success,
  };
}

function callAscii2dUrlApi(host, imgUrl) {
  return Axios.cfGet(`${host}/search/url/${imgUrl}`);
}

async function callAscii2dUploadApi(host, imgUrl) {
  const imgBuffer = await Axios.get(imgUrl, { responseType: 'arraybuffer' }).then(r => r.data);
  const form = new FormData();
  form.append('file', imgBuffer, 'image');
  return Axios.cfPost(`${host}/search/file`, form, { headers: form.getHeaders() });
}

function callAscii2dUrlApiWithPuppeteer(host, imgUrl) {
  return getAscii2dWithPuppeteer(`${host}/search/url/${imgUrl}`);
}

async function getAscii2dWithPuppeteer(url) {
  const { puppeteer } = await import('../../libs/puppeteer/index.mjs');
  return await puppeteer.get(url, 'body > .container');
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
  const $itemBox = $('.item-box');
  for (let i = 0; i < $itemBox.length; i++) {
    const $box = $($itemBox[i]);
    const $link = $box.find('.detail-box a');
    // 普通结果
    if ($link.length) {
      const $title = $($link[0]);
      const $author = $($link[1]);
      result = {
        thumbnail: baseURL + $box.find('.image-box img').attr('src'),
        title: $title.text(),
        author: $author.text(),
        url: $title.attr('href'),
        author_url: $author.attr('href'),
      };
      break;
    }
    // 人为提交结果
    const $external = $box.find('.external');
    if ($external.length) {
      result = {
        thumbnail: baseURL + $box.find('.image-box img').attr('src'),
        title: $external.text(),
      };
      break;
    }
  }
  if (!result.title) {
    logError('[error] ascii2d getDetail');
    logError(ret);
  }
  return result;
}

async function getResult({ url, title, author, thumbnail, author_url }, snLowAcc = false) {
  if (!title) return { success: false, result: '由未知错误导致搜索失败' };
  const texts = [CQ.escape(author ? `「${title}」/「${author}」` : title)];
  if (thumbnail && !(global.config.bot.hideImg || (snLowAcc && global.config.bot.hideImgWhenLowAcc))) {
    const mode = global.config.bot.antiShielding;
    if (mode > 0) texts.push(await getAntiShieldedCqImg64FromUrl(thumbnail, mode));
    else texts.push(await getCqImg64FromUrl(thumbnail));
  }
  if (url) texts.push(CQ.escape(confuseURL(url)));
  if (author_url) texts.push(`Author: ${CQ.escape(confuseURL(author_url))}`);
  return { success: true, result: texts.join('\n') };
}

export default doSearch;
