import * as Cheerio from 'cheerio';
import { URL } from 'url';
const Axios = require('./axiosProxy');

const domainList = new Set(['danbooru.donmai.us', 'konachan.com', 'yande.re', 'gelbooru.com']);

/**
 * 得到图源
 *
 * @export
 * @param {String} url URL
 * @returns URL
 */
export default async function (url) {
  const { host } = new URL(url);
  if (!domainList.has(host)) return null;
  const { data } = await Axios.get(url);
  const $ = Cheerio.load(data);
  switch (host) {
    case 'danbooru.donmai.us':
      return $('.image-container').attr('data-normalized-source');
    case 'konachan.com':
    case 'yande.re':
      return $('#stats li:contains(Source) a').attr('href');
    case 'gelbooru.com':
      return $('#tag-list li:contains(Source) a').attr('href');
    default:
      return null;
  }
}
