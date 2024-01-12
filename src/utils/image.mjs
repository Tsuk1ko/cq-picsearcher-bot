import { promisify } from 'util';
import imageSize from 'image-size';
import Jimp from 'jimp';
import promiseLimit from 'promise-limit';
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
      e => e.code === 'ECONNRESET'
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
      e => e.code === 'ECONNRESET'
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
 * @returns
 */
export const dlImgToCache = async (url, config = {}) => {
  const cachedPath = getCache(url);
  if (cachedPath) return cachedPath;
  const { data } = await dlImgLimit(() => retryGet(url, { responseType: 'arraybuffer', ...config }));
  return createCache(url, data);
};

const minusMod3 = num => num - (num % 3);

/**
 * @param {string[]} paths
 */
const check9ImgCanMerge = async paths => {
  if (paths.length < 3) return 0;
  if (paths.length === 9 && getCache(paths.join(','))) return 9;
  if (paths.length >= 6 && getCache(paths.slice(0, 6).join(','))) return 6;
  if (paths.length >= 3 && getCache(paths.slice(0, 3).join(','))) return 3;
  try {
    let fw = 0;
    for (const [i, path] of paths.entries()) {
      const size = await imageSizeAsync(path);
      if (size.width !== size.height || size.type === 'gif') return minusMod3(i + 1);
      if (i === 0) fw = size.width;
      else if (size.width !== fw) return minusMod3(i + 1);
    }
  } catch (error) {
    console.error('[utils/image] get image size error');
    console.error(error);
    return 0;
  }
  return minusMod3(paths.length);
};

/**
 * @param {string[]} paths
 * @param {number} count
 */
const mergeImgs = async (paths, count) => {
  const mergePaths = paths.slice(0, count);
  const cacheKey = mergePaths.join(',');
  const cachedImg = getCache(cacheKey);
  if (cachedImg) return [cachedImg, ...paths.slice(count)];
  const imgs = await Promise.all(mergePaths.map(path => Jimp.read(path)));
  const width = imgs[0].getWidth();
  const mergedImg = new Jimp(width * 3, width * Math.round(count / 3));
  for (const [i, img] of imgs.entries()) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    mergedImg.blit(img, col * width, row * width);
  }
  const buffer = await mergedImg.getBufferAsync(Jimp.MIME_PNG);
  return [createCache(cacheKey, buffer), ...paths.slice(count)];
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
  const mergeCount = await check9ImgCanMerge(paths);
  if (!mergeCount) return paths;
  try {
    return await mergeImgs(paths, mergeCount);
  } catch (error) {
    console.error('[utils/image] merge9Imgs error');
    console.error(error);
    return paths;
  }
};
