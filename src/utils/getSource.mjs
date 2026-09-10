import { URL } from 'node:url';
import * as Cheerio from 'cheerio';
import Axios from './axiosProxy.mjs';

const domainList = new Set(['danbooru.donmai.us', 'konachan.com', 'yande.re', 'gelbooru.com']);

/**
 * 得到图源
 *
 * @export
 * @param {string} url URL
 * @returns URL or String
 */
export default async function (url) {
  const { host, protocol } = new URL(url);
  // 仅允许固定的 https 图源站点，且禁止跟随重定向，避免被诱导请求内网/元数据地址（SSRF）
  if (protocol !== 'https:' || !domainList.has(host)) return null;
  const { data } = await Axios.get(url, { maxRedirects: 0 });
  const $ = Cheerio.load(data);
  switch (host) {
    case 'danbooru.donmai.us':
    case 'gelbooru.com':
      return $('.image-container').attr('data-normalized-source');
    case 'konachan.com':
    case 'yande.re':
      return $('#post_source').attr('value');
    default:
      return null;
  }
}
