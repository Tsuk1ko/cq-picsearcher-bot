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
  const result = selectBestResult(data.results);
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

  const candidates = results
    .flatMap(result => {
      if (!Array.isArray(result.path_segments)) return [];
      return result.path_segments.map(segment => ({
        ...segment,
        score: result.score,
      }));
    })
    .filter(result => Number.isFinite(Number(result.score)))
    .sort((a, b) => Number(b.score) - Number(a.score));
  if (!candidates.length) return null;

  const first = candidates[0];
  if (isChineseResult(first)) return first;

  const firstScore = Number(first.score);
  for (const result of candidates.slice(1)) {
    if (firstScore - Number(result.score) > CN_SIMILARITY_RANGE) break;
    if (isChineseResult(result)) return result;
  }

  return first;
}

function isChineseResult({ language, metadata, source_key: sourceKey }) {
  const metadataLanguage = metadata?.facts?.language;
  if (language === 'zh' || metadataLanguage === 'chinese') return true;
  return !language && !metadataLanguage && sourceKey === 'jmcomic';
}

async function getResult({ metadata, thumbnail_url: thumbnailUrl, source_url: sourceUrl, score }) {
  const title = metadata?.title?.japanese_or_alias || metadata?.title?.primary;
  const texts = [`SoutuBot (${Number(score).toFixed(2)}%)`];
  if (title) texts.push(CQ.escape(title));
  if (thumbnailUrl && !global.config.bot.hideImg) {
    try {
      const image = await getPreviewImage(thumbnailUrl);
      texts.push(image || '[缩略图获取失败]');
    } catch (error) {
      texts.push('[缩略图获取失败]');
      console.error('[soutuBot] get result thumbnail error:', thumbnailUrl);
      logError(error);
    }
  }

  if (sourceUrl) texts.push(CQ.escape(confuseURL(sourceUrl)));

  return texts.join('\n');
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
