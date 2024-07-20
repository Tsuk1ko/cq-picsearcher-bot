import { pathToFileURL } from 'url';
import CQ from '../../utils/CQcode.mjs';
import { dlAndMergeImgsIfCan } from '../../utils/image.mjs';

/**
 * 净化链接
 * @param {string} link
 */
export const purgeLink = link => {
  try {
    const url = new URL(link);
    if (url.hostname === 'live.bilibili.com') {
      url.search = '';
      url.hash = '';
      return url.href;
    }
    url.searchParams.delete('spm_id_from');
    return url.href;
  } catch (e) {}
  return link;
};

/**
 * 净化文本中的链接
 * @param {string} text
 */
export const purgeLinkInText = text => text.replace(/https?:\/\/[-\w~!@#$%&*()+=;':,.?/]+/g, url => purgeLink(url));

/**
 * @param {string[]} urls
 */
export const handleImgsByConfig = async urls => {
  const { dynamicImgPreDl, imgPreDlTimeout, dynamicMergeImgs } = global.config.bot.bilibili;
  if (dynamicImgPreDl) {
    const config = { timeout: imgPreDlTimeout * 1000 };
    return dynamicMergeImgs
      ? (await dlAndMergeImgsIfCan(urls, config)).map(url => CQ.img(pathToFileURL(url).href))
      : await Promise.all(urls.map(url => CQ.imgPreDl(url, undefined, config)));
  }
  return urls.map(url => CQ.img(url));
};
