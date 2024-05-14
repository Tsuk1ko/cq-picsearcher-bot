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

export const getCqImg64FromUrl = async (url, type = undefined) => {
  try {
    const base64 = await retryAsync(
      () => Axios.getBase64(url),
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

export const getAntiShieldedCqImg64FromUrl = async (url, mode, type = undefined) => {
  try {
    const arrayBuffer = await retryAsync(
      () => Axios.get(url, { responseType: 'arraybuffer' }).then(r => r.data),
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
          width <= 800 &&
          height <= 800 &&
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
