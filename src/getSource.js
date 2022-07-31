import * as Cheerio from 'cheerio';
import { URL } from 'url';
const Axios = require('./axiosProxy');

const domainList = new Set(['danbooru.donmai.us', 'konachan.com', 'yande.re', 'gelbooru.com']);

/**
 * 得到图源
 *
 * @export
 * @param {String} url URL
 * @returns URL or String
 */
export default async function (url) {
  const { host } = new URL(url);
  if (!domainList.has(host)) return null;
  const { data } = await Axios.get(url);
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
