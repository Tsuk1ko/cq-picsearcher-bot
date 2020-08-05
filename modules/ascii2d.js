import { get } from './axiosProxy';
import Cheerio from 'cheerio';
import CQ from './CQcode';
import config from './config';
import pixivShorten from './urlShorten/pixiv';
import logError from './logError';

const hosts = config.ascii2dHost;
let hostsI = 0;

/**
 * ascii2d 搜索
 *
 * @param {string} url 图片地址
 * @returns 色合検索 和 特徴検索 结果
 */
async function doSearch(url) {
  let host = hosts[hostsI++ % hosts.length];
  if (host === 'ascii2d.net') host = `https://${host}`;
  else if (!/^https?:\/\//.test(host)) host = `http://${host}`;
  let { colorURL, colorDetail } = await get(`${host}/search/url/${encodeURIComponent(url)}`).then(r => ({
    colorURL: r.request.res.responseUrl,
    colorDetail: getDetail(r, host),
  }));
  let bovwURL = colorURL.replace('/color/', '/bovw/');
  let bovwDetail = await get(bovwURL).then(r => getDetail(r, host));
  return {
    color: 'ascii2d 色合検索\n' + getShareText(colorDetail),
    bovw: 'ascii2d 特徴検索\n' + getShareText(bovwDetail),
  };
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
  const $ = Cheerio.load(html, {
    decodeEntities: false,
  });
  const $itembox = $('.item-box');
  for (let i = 0; i < $itembox.length; i++) {
    const $box = $($itembox[i]);
    const $link = $box.find('.detail-box a');
    if ($link.length === 0) continue;
    const $title = $($link[0]);
    const $author = $($link[1]);
    result = {
      thumbnail: baseURL + $box.find('.image-box img').attr('src'),
      title: $title.html(),
      author: $author.html(),
      url: $title.attr('href'),
      author_url: $author.attr('href'),
    };
    break;
  }
  if (!result.url) {
    logError(`${new Date().toLocaleString()} [error] ascii2d getDetail`);
    logError(ret);
  }
  return result;
}

function getShareText({ url, title, author, thumbnail, author_url }) {
  if (!url) return '由未知错误导致搜索失败';
  let text = `「${title}」/「${author}」
${CQ.img(thumbnail)}
${pixivShorten(url)}`;
  if (author_url) text += `\nAuthor: ${pixivShorten(author_url)}`;
  return text;
}

export default doSearch;
