import { readFileSync } from 'fs';
import { promisify } from 'util';
import imageSize from 'image-size';
import Jimp from 'jimp';
import { sumBy } from 'lodash-es';
import promiseLimit from 'promise-limit';
import asyncMap from './asyncMap.mjs';
import Axios from './axiosProxy.mjs';
import { createCache, getCache } from './cache.mjs';
import CQ from './CQcode.mjs';
import { imgAntiShielding } from './imgAntiShielding.mjs';
import logError from './logError.mjs';
import { retryAsync, retryGet } from './retry.mjs';

const imageSizeAsync = promisify(imageSize);

export const getCqImg64FromUrl = async (url, type = undefined, cf = false) => {
  try {
    const base64 = await retryAsync(
      () => (cf ? Axios.cfGetBase64 : Axios.getBase64)(url),
      3,
      e => e.code === 'ECONNRESET',
    );
    return CQ.img64(base64, type);
  } catch (e) {
    logError('[error] getCqImg64FromUrl');
    logError(e);
  }
  return '';
};

export const getAntiShieldedCqImg64FromUrl = async (url, mode, type = undefined, cf = false) => {
  try {
    const arrayBuffer = await retryAsync(
      () => (cf ? Axios.cfGet : Axios.get)(url, { responseType: 'arraybuffer' }).then(r => r.data),
      3,
      e => e.code === 'ECONNRESET',
    );
    const img = await Jimp.read(Buffer.from(arrayBuffer));
    const base64 = await imgAntiShielding(img, mode);
    return CQ.img64(base64, type);
  } catch (e) {
    logError('[error] getAntiShieldedCqImg64FromUrl');
    logError(e);
  }
  return '';
};

const dlImgLimit = promiseLimit(4);

/**
 * @param {string} url
 * @param {import('axios').AxiosRequestConfig} [config] Axios 配置
 * @param {boolean} [limit] 是否限制并发数
 */
export const dlImgToCache = async (url, config = {}, limit = false) => {
  const cachedPath = getCache(url);
  if (cachedPath) return cachedPath;
  const dlFn = () => retryGet(url, { responseType: 'arraybuffer', ...config });
  const { data } = await (limit ? dlImgLimit(dlFn) : dlFn());
  return createCache(url, Buffer.from(data));
};

/**
 * @param {string} url
 * @param {import('axios').AxiosRequestConfig} [config] Axios 配置
 * @param {boolean} [limit] 是否限制并发数
 */
export const dlImgToCacheBuffer = async (url, config = {}, limit = false) => {
  const cachedPath = getCache(url);
  if (cachedPath) return readFileSync(cachedPath);
  const dlFn = () => retryGet(url, { responseType: 'arraybuffer', ...config });
  const { data } = await (limit ? dlImgLimit(dlFn) : dlFn());
  const buffer = Buffer.from(data);
  createCache(url, buffer);
  return buffer;
};

const MAX_MERGE_SIZE = 1024;

/**
 * @param {string[]} paths
 */
const check9ImgCanMerge = async paths => {
  const result = { width: 0, height: 0, lines: 0, points: [] };
  if (paths.length < 3) return result;
  if (paths.length === 9 && getCache(paths.join(','))) {
    result.lines = 3;
    return result;
  }
  if (paths.length >= 6 && getCache(paths.slice(0, 6).join(','))) {
    result.lines = 2;
    return result;
  }
  if (paths.length >= 3 && getCache(paths.slice(0, 3).join(','))) {
    result.lines = 1;
    return result;
  }
  try {
    const maxLines = Math.floor(paths.length / 3);
    for (; result.lines < maxLines; result.lines++) {
      const curPaths = paths.slice(result.lines * 3, (result.lines + 1) * 3);
      if (curPaths.length < 3) return result;
      const sizes = await asyncMap(curPaths, path => imageSizeAsync(path));
      const check = sizes.every(
        ({ width, height, type }) =>
          type !== 'gif' &&
          height === sizes[0].height &&
          width <= MAX_MERGE_SIZE &&
          height <= MAX_MERGE_SIZE &&
          Math.abs(width - height) / height < 0.15,
      );
      if (!check) return result;
      const widthSum = sumBy(sizes, 'width');
      if (result.lines === 0) result.width = widthSum;
      else if (result.width !== widthSum) return result;
      result.points.push(
        { x: 0, y: result.height },
        { x: sizes[0].width, y: result.height },
        { x: sizes[0].width + sizes[1].width, y: result.height },
      );
      result.height += sizes[0].height;
    }
  } catch (error) {
    console.error('[utils/image] get image size error');
    console.error(error);
    result.lines = 0;
    return result;
  }
  return result;
};

/**
 * @param {string[]} paths
 * @param {Awaited<ReturnType<typeof check9ImgCanMerge>>} info
 */
const mergeImgs = async (paths, info) => {
  const mergePaths = paths.slice(0, info.lines * 3);
  const restPaths = paths.slice(info.lines * 3);
  const cacheKey = mergePaths.join(',');
  const cachedImg = getCache(cacheKey);
  if (cachedImg) return [cachedImg, ...restPaths];
  const imgs = await asyncMap(mergePaths, path => Jimp.read(path));
  const mergedImg = new Jimp(info.width, info.height);
  for (const [i, img] of imgs.entries()) {
    const { x, y } = info.points[i];
    mergedImg.blit(img, x, y);
  }
  const buffer = await mergedImg.getBufferAsync(Jimp.MIME_PNG);
  return [createCache(cacheKey, buffer), ...restPaths];
};

/**
 * @param {string[]} urls
 * @param {import('axios').AxiosRequestConfig} [config] Axios 配置
 */
export const dlAndMergeImgsIfCan = async (urls, config = {}) => {
  let paths;
  try {
    paths = await Promise.all(urls.map(url => dlImgToCache(url, config)));
  } catch (error) {
    console.error('[utils/image] image download error');
    console.error(error);
    return urls;
  }
  const mergeInfo = await check9ImgCanMerge(paths);
  if (!mergeInfo.lines) return paths;
  try {
    return await mergeImgs(paths, mergeInfo);
  } catch (error) {
    console.error('[utils/image] merge9Imgs error');
    console.error(error);
    return paths;
  }
};

/**
 * @param {string} url
 */
export const getImageSizeByUrl = async url => {
  const path = await dlImgToCache(url, { timeout: 10e3 });
  return await imageSizeAsync(path);
};

/**
 * @param {string} url
 * @param {number} max
 */
export const checkImageHWRatio = async (url, max) => {
  try {
    const { width, height } = await getImageSizeByUrl(url);
    return height / width < max;
  } catch (error) {
    console.error('[utils/image] checkImageHWRatio error');
    console.error(error);
    return true;
  }
};

export const getUniversalImgURL = (url = '') => {
  if (/^https?:\/\/(c2cpicdw|gchat)\.qpic\.cn\/(offpic|gchatpic)_new\//.test(url)) {
    return url
      .replace('/c2cpicdw.qpic.cn/offpic_new/', '/gchat.qpic.cn/gchatpic_new/')
      .replace('/gchat.qpic.cn/offpic_new/', '/gchat.qpic.cn/gchatpic_new/')
      .replace(/\/\d+\/+\d+-\d+-/, '/0/0-0-')
      .replace(/\?.*$/, '');
  }
  return url;
};

export class MsgImage {
  /**
   * @param {CQ} cq
   */
  constructor(cq) {
    this.cq = cq;
    this.file = cq.data.get('file');
    this.url = getUniversalImgURL(cq.data.get('url') || this.file);
    /** @type {string|undefined} */
    this.path = undefined;
    this.key = cq.data.get('file_unique') || this.file;
  }

  get isUrlValid() {
    return typeof this.url === 'string' && /^https?:\/\/[^&]+\//.test(this.url);
  }

  /**
   * @returns {Promise<string|undefined>}
   */
  async getPath() {
    if (this.path) return this.path;
    try {
      this.path = (await global.bot('get_image', { file: this.file })).data.file;
      return this.path;
    } catch (error) {
      console.error('[MsgImage] getImage error', this.file);
      console.error(error);
    }
  }

  async getImageSize() {
    const path = await this.getPath();
    if (path) return imageSize(path);
    if (this.isUrlValid) return await imageSizeAsync(this.url);
    throw new Error(`[MsgImage] invalid image ${this.url}`);
  }

  /**
   * @param {number} max
   */
  async checkImageHWRatio(max) {
    try {
      const { width, height } = await this.getImageSize();
      return height / width < max;
    } catch (error) {
      console.error('[MsgImage] checkImageHWRatio error');
      console.error(error);
      return true;
    }
  }

  /**
   * @param {boolean} [cf]
   * @returns {Jimp}
   */
  async getJimp(cf = false) {
    const path = await this.getPath();
    if (path) return Jimp.read(path);
    if (this.isUrlValid) {
      const arrayBuffer = await retryAsync(
        () => (cf ? Axios.cfGet : Axios.get)(this.url, { responseType: 'arraybuffer' }).then(r => r.data),
        3,
        e => e.code === 'ECONNRESET',
      );
      return await Jimp.read(Buffer.from(arrayBuffer));
    }
    throw new Error('[MsgImage] getJimp no available image');
  }

  /**
   * @param {number} mode
   * @param {string} [type]
   * @param {boolean} [cf]
   */
  async getAntiShieldedCqImg64(mode, type = undefined, cf = false) {
    try {
      const img = await this.getJimp(cf);
      const base64 = await imgAntiShielding(img, mode);
      return CQ.img64(base64, type);
    } catch (e) {
      logError('[MsgImage] getAntiShieldedCqImg64 error');
      logError(e);
    }
    return '';
  }

  toCQ() {
    return this.cq.toString();
  }
}
