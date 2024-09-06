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
  const { dynamicImgPreDl, imgPreDlTimeout, dynamicMergeImgs, dynamicImgLimit } = global.config.bot.bilibili;
  const appendLines = [];
  if (dynamicImgLimit === 0) return [CQ.escape(`[图片*${urls.length}]`)];
  else if (dynamicImgLimit > 0 && urls.length > dynamicImgLimit) {
    appendLines.push(CQ.escape(`[图片*${urls.length - dynamicImgLimit}]`));
    urls = urls.slice(0, dynamicImgLimit);
  }
  let lines;
  if (dynamicImgPreDl) {
    const config = { timeout: imgPreDlTimeout * 1000 };
    lines =
      dynamicMergeImgs && !appendLines.length
        ? (await dlAndMergeImgsIfCan(urls, config)).map(url => CQ.img(pathToFileURL(url).href))
        : await Promise.all(urls.map(url => CQ.imgPreDl(url, undefined, config)));
  } else lines = urls.map(url => CQ.img(url));
  return lines.concat(appendLines);
};
