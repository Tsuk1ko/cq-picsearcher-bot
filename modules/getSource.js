import { get } from './axiosProxy';
import Cheerio from 'cheerio';
import { parse } from 'url';

const domainList = ['danbooru.donmai.us', 'konachan.com', 'yande.re', 'gelbooru.com'];

/**
 * 得到图源
 *
 * @export
 * @param {String} url URL
 * @returns URL
 */
export default async function(url) {
    const { hostname } = parse(url);
    if (!domainList.includes(hostname)) return null;
    const { data } = await get(url);
    const $ = Cheerio.load(data);
    switch (hostname) {
        case 'danbooru.donmai.us':
            return $('#image-container').attr('data-normalized-source');
        case 'konachan.com':
        case 'yande.re':
            return $('#stats li:contains(Source) a').attr('href');
        case 'gelbooru.com':
            return $('#tag-list li:contains(Source) a').attr('href');
        default:
            return null;
    }
}
