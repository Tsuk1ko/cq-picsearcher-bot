import { readFileSync } from 'fs';
import FormData from 'form-data';
import Axios from '../utils/axiosProxy.mjs';
import { cloudflareBypassForScraping } from '../utils/cloudflareBypassForScraping.mjs';
import CQ from '../utils/CQcode.mjs';
import { getAntiShieldedCqImg64FromUrl, getCqImg64FromUrl } from '../utils/image.mjs';
import { imgAntiShieldingFromArrayBuffer } from '../utils/imgAntiShielding.mjs';
import { confuseURL } from '../utils/url.mjs';

const USER_AGENT = '';
const MAIN_PAGE_URL = 'https://soutubot.moe';
const API_URL = 'https://soutubot.moe/api/search';
const FACTOR = '1.2';
const CN_SIMILARITY_RANGE = 10;
const SOURCE_HOSTS = {
  nhentai: 'https://nhentai.net',
  ehentai: 'https://e-hentai.org',
  panda: 'https://panda.chaika.moe',
};

let cache = {
  m: 0,
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
  const result = selectBestResult(data.data);
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
  if (!cache.m) await refreshCache();

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
  const ret = global.config.cloudflareBypassForScraping.enableForSoutuBot
    ? await cloudflareBypassForScraping.get(MAIN_PAGE_URL)
    : await Axios.get(MAIN_PAGE_URL, { headers: { 'User-Agent': USER_AGENT }, responseType: 'text' });

  const m = getGlobalM(ret.data);
  if (m <= 0) throw new Error(`SoutuBot 获取 m 失败：${m}`);

  cache = {
    m,
    cookies: getCookies(ret.headers),
  };
}

/**
 * @param {string} body
 */
function getGlobalM(body) {
  const match = /m:\s*(-?\d+),/.exec(body);
  if (!match) return -1;
  const m = Number(match[1]);
  return Number.isFinite(m) ? m : -2;
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
 * @param {MsgImage} img
 */
async function callSoutuBotApi(img) {
  const path = await img.getPath();
  if (!path) {
    // eslint-disable-next-line no-throw-literal
    throw '部分图片无法获取，如为转发请尝试保存后再手动发送，或使用其他设备手动发送';
  }

  const form = new FormData();
  form.append('file', readFileSync(path), 'image');
  form.append('factor', FACTOR);

  const headers = {
    ...form.getHeaders(),
    Accept: 'application/json, text/plain, */*',
    Origin: MAIN_PAGE_URL,
    Referer: `${MAIN_PAGE_URL}/`,
    Dnt: '1',
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': USER_AGENT,
    'X-Api-Key': calcApiKey(USER_AGENT.length, cache.m),
  };

  const ret = global.config.cloudflareBypassForScraping.enableForSoutuBot
    ? await cloudflareBypassForScraping.post(API_URL, form, headers, 'json')
    : await Axios.post(API_URL, form, {
        headers: cache.cookies ? { ...headers, Cookie: cache.cookies } : headers,
        responseType: 'json',
      });

  return ret.data;
}

/**
 * @param {number} uaLen
 * @param {number} m
 */
function calcApiKey(uaLen, m) {
  const ts = Math.floor(Date.now() / 1000);
  const sum = ts ** 2 + uaLen ** 2 + m;
  return Buffer.from(String(sum)).toString('base64').replace(/=/g, '').split('').reverse().join('');
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
  const image = await getPreviewImage(previewImageUrl);
  if (image) texts.push(image);

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
  if (!url || global.config.bot.hideImg) return '';

  const mode = global.config.bot.antiShielding;
  if (global.config.cloudflareBypassForScraping.enableForSoutuBot) {
    const img = await cloudflareBypassForScraping.getImage(url);
    return CQ.img64(mode > 0 ? await imgAntiShieldingFromArrayBuffer(img, mode) : img);
  }

  return mode > 0 ? await getAntiShieldedCqImg64FromUrl(url, mode) : await getCqImg64FromUrl(url);
}

export default doSearch;
