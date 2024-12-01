import { readFileSync } from 'fs';
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
 * @param {MsgImage} img 图片
 * @returns 色合検索 和 特徴検索 结果
 */
async function doSearch(img, snLowAcc = false) {
  const hosts = global.config.ascii2dHost;
  let host = hosts[hostsI++ % hosts.length];
  if (!/^https?:\/\//.test(host)) host = `https://${host}`;
  const callApi = global.config.bot.ascii2dUsePuppeteer ? callAscii2dUrlApiWithPuppeteer : callAscii2dApi;
  const { colorURL, colorDetail } = await retryAsync(
    async () => {
      const ret = await callApi(host, img);
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
    e => typeof e !== 'string' && String(_.get(e, 'response.data')).trim() === 'first byte timeout',
  );
  const bovwURL = colorURL.replace('/color/', '/bovw/');
  const bovwDetail = await (global.config.bot.ascii2dUsePuppeteer ? getAscii2dWithPuppeteer : Axios.cfGet)(
    bovwURL,
  ).then(r => getDetail(r, host));
  const isCf = host === 'https://ascii2d.net';
  const colorRet = await getResult(colorDetail, snLowAcc, isCf);
  const bovwRet = await getResult(bovwDetail, snLowAcc, isCf);
  return {
    color: `ascii2d 色合検索\n${colorRet.result}`,
    bovw: `ascii2d 特徴検索\n${bovwRet.result}`,
    success: colorRet.success && bovwRet.success,
  };
}

/**
 * @param {MsgImage} img
 */
async function callAscii2dApi(host, img) {
  const isCf = host === 'https://ascii2d.net';

  if (global.config.bot.ascii2dLocalUpload || !img.isUrlValid) {
    const path = await img.getPath();
    if (path) {
      const form = new FormData();
      form.append('file', readFileSync(path), 'image');
      return Axios[isCf ? 'cfPost' : 'post'](`${host}/search/file`, form, { headers: form.getHeaders() });
    }
  }

  if (img.isUrlValid) {
    return Axios[isCf ? 'cfGet' : 'get'](`${host}/search/url/${img.url}`);
  }

  // eslint-disable-next-line no-throw-literal
  throw '部分图片无法获取，如为转发请尝试保存后再手动发送，或使用其他设备手动发送';
}

/**
 * @param {MsgImage} img
 */
function callAscii2dUrlApiWithPuppeteer(host, img) {
  if (!img.isUrlValid) {
    // eslint-disable-next-line no-throw-literal
    throw '部分图片无法获取，如为转发请尝试保存后再手动发送，或使用其他设备手动发送';
  }
  return getAscii2dWithPuppeteer(`${host}/search/url/${img.url}`);
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

async function getResult({ url, title, author, thumbnail, author_url }, snLowAcc = false, isCf = true) {
  if (!title) return { success: false, result: '由未知错误导致搜索失败' };
  const texts = [CQ.escape(author ? `「${title}」/「${author}」` : title)];
  if (thumbnail && !(global.config.bot.hideImg || (snLowAcc && global.config.bot.hideImgWhenLowAcc))) {
    const mode = global.config.bot.antiShielding;
    if (mode > 0) texts.push(await getAntiShieldedCqImg64FromUrl(thumbnail, mode, undefined, isCf));
    else texts.push(await getCqImg64FromUrl(thumbnail, undefined, isCf));
  }
  if (url) texts.push(CQ.escape(confuseURL(url)));
  if (author_url) texts.push(`Author: ${CQ.escape(confuseURL(author_url))}`);
  return { success: true, result: texts.join('\n') };
}

export default doSearch;
