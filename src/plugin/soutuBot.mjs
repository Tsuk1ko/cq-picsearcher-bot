import { readFileSync, statSync } from 'node:fs';
import { basename } from 'node:path';
import FormData from 'form-data';
import Axios from '../utils/axiosProxy.mjs';
import { createCache, getCache } from '../utils/cache.mjs';
import { cloudflareBypassForScraping } from '../utils/cloudflareBypassForScraping.mjs';
import CQ from '../utils/CQcode.mjs';
import { flareSolverr } from '../utils/flareSolverr.mjs';
import { getAntiShieldedCqImg64FromUrl, getCqImg64FromUrl } from '../utils/image.mjs';
import { imgAntiShieldingFromArrayBuffer } from '../utils/imgAntiShielding.mjs';
import Jimp from '../utils/jimp.mjs';
import logError from '../utils/logError.mjs';
import { confuseURL } from '../utils/url.mjs';

const MAIN_PAGE_URL = 'https://soutubot.moe';
const API_URL = 'https://soutubot.moe/api/search';
const FACTOR = '1.2';
const CN_SIMILARITY_RANGE = 10;
const COMPRESS_MIN_SIZE = 900 * 1024;
const COMPRESS_MAX_WIDTH = 2000;
const COMPRESS_QUALITY = 90;
const SOURCE_HOSTS = {
  nhentai: 'https://nhentai.net',
  ehentai: 'https://e-hentai.org',
  panda: 'https://panda.chaika.moe',
};

let cache = {
  cookies: '',
};

/**
 * SoutuBot 搜索
 *
 * @param {MsgImage} img 图片
 * @returns {Promise<{ success: boolean, msgs: string[] }>}
 */
async function doSearch(img) {
  const data = await doSearchRequest(img);
  console.log('data: ', JSON.stringify(data));
  const result = selectBestResult(data.data);
  console.log('result: ', JSON.stringify(result));
  if (!result) {
    return {
      success: false,
      msgs: ['SoutuBot 搜索失败：没有找到结果'],
    };
  }

  return {
    success: true,
    msgs: [await getResult(result)],
  };
}

/**
 * @param {MsgImage} img
 */
async function doSearchRequest(img) {
  if (!cache.cookies) await refreshCache();

  const request = () => callSoutuBotApi(img);
  try {
    return await request();
  } catch (e) {
    if (!e.response || ![401, 403].includes(e.response.status)) throw e;
    await refreshCache();
    return request();
  }
}

async function refreshCache() {
  let ret;
  let cookies = '';

  if (global.config.flaresolverr.enableForSoutuBot) {
    ret = await flareSolverr.get(MAIN_PAGE_URL);
  } else if (global.config.cloudflareBypassForScraping.enableForSoutuBot) {
    ret = await cloudflareBypassForScraping.get(MAIN_PAGE_URL);
  } else {
    ret = await Axios.get(MAIN_PAGE_URL, { responseType: 'text' });
    cookies = getCookies(ret.headers);
  }

  cache = {
    cookies,
  };
}

function getCookies(headers = {}) {
  const setCookie = headers['set-cookie'];
  if (!Array.isArray(setCookie)) return '';
  return setCookie
    .map(cookie => cookie.split(';')[0])
    .filter(Boolean)
    .join('; ');
}

/**
 * @param {string} path
 * @returns {Promise<[Buffer, string]>}
 */
async function getSoutuBotUploadBuffer(path) {
  if (statSync(path).size < COMPRESS_MIN_SIZE) {
    return [readFileSync(path), basename(path)];
  }

  const cachedPath = getCache(path);
  if (cachedPath) return [readFileSync(cachedPath), 'image.jpg'];

  const img = await Jimp.read(path);
  if (img.width > COMPRESS_MAX_WIDTH) {
    img.resize({ w: COMPRESS_MAX_WIDTH });
  }
  const buffer = await img.getBuffer('image/jpeg', { quality: COMPRESS_QUALITY });
  createCache(path, buffer);
  return [buffer, 'image.jpg'];
}

/**
 * @param {MsgImage} img
 */
async function callSoutuBotApi(img) {
  const path = await img.getPath();
  if (!path) {
    // eslint-disable-next-line no-throw-literal
    throw '部分图片无法获取，如为转发请尝试保存后再手动发送，或使用其他设备手动发送';
  }

  const form = new FormData();
  form.append('file', ...(await getSoutuBotUploadBuffer(path)));
  form.append('factor', FACTOR);

  const headers = {
    ...form.getHeaders(),
    Accept: 'application/json',
    'Accept-Language': 'zh-CN',
    Origin: MAIN_PAGE_URL,
    Referer: `${MAIN_PAGE_URL}/`,
    Dnt: '1',
  };

  const ret = global.config.flaresolverr.enableForSoutuBot
    ? await flareSolverr.post(API_URL, form, headers, 'json')
    : global.config.cloudflareBypassForScraping.enableForSoutuBot
      ? await cloudflareBypassForScraping.post(API_URL, form, headers, 'json')
      : await Axios.post(API_URL, form, {
          headers: cache.cookies ? { ...headers, Cookie: cache.cookies } : headers,
          responseType: 'json',
        });

  return ret.data;
}

/**
 * @param {Array} results
 */
function selectBestResult(results) {
  if (!Array.isArray(results) || !results.length) return null;

  const first = results[0];
  if (first.language === 'cn') return first;

  const firstSimilarity = Number(first.similarity);
  for (let i = 1; i < results.length; i++) {
    const result = results[i];
    const similarityDiff = firstSimilarity - Number(result.similarity);
    if (similarityDiff > CN_SIMILARITY_RANGE) break;
    if (result.language === 'cn') return result;
  }

  return first;
}

async function getResult({ source, title, subjectPath, previewImageUrl, similarity }) {
  const texts = [`SoutuBot (${similarity}%)`, CQ.escape(title || '')];
  if (previewImageUrl && !global.config.bot.hideImg) {
    try {
      const image = await getPreviewImage(previewImageUrl);
      texts.push(image || '[缩略图获取失败]');
    } catch (error) {
      texts.push('[缩略图获取失败]');
      console.error('[soutuBot] get result thumbnail error:', previewImageUrl);
      logError(error);
    }
  }

  const url = getSubjectUrl(source, subjectPath);
  if (url) texts.push(CQ.escape(confuseURL(url)));

  return texts.join('\n');
}

/**
 * @param {string} source
 * @param {string} subjectPath
 */
function getSubjectUrl(source, subjectPath) {
  const host = SOURCE_HOSTS[source];
  if (!host || !subjectPath) return '';
  return `${host}${subjectPath}`;
}

/**
 * @param {string} url
 */
async function getPreviewImage(url) {
  const mode = global.config.bot.antiShielding;

  const img = global.config.flaresolverr.enableForSoutuBot
    ? await flareSolverr.getImage(url)
    : global.config.cloudflareBypassForScraping.enableForSoutuBot
      ? await cloudflareBypassForScraping.getImage(url)
      : null;

  if (img) {
    return CQ.img64(mode > 0 ? await imgAntiShieldingFromArrayBuffer(img, mode) : img);
  }

  return mode > 0 ? await getAntiShieldedCqImg64FromUrl(url, mode) : await getCqImg64FromUrl(url);
}

export default doSearch;
