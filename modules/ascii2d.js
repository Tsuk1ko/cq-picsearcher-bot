import { get } from './axiosProxy';
import Cheerio from 'cheerio';
import CQ from './CQcode';
import config from './config';

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
    let { colorURL, colorHTML } = await get(`${host}/search/url/${encodeURIComponent(url)}`).then(r => ({
        colorURL: r.request.res.responseUrl,
        colorHTML: r.data,
    }));
    let bovwURL = colorURL.replace('/color/', '/bovw/');
    let bovwHTML = await get(bovwURL).then(r => r.data);
    return {
        color: 'ascii2d 色合検索\n' + getShareText(getDetail(colorHTML, host)),
        bovw: 'ascii2d 特徴検索\n' + getShareText(getDetail(bovwHTML, host)),
    };
}

/**
 * 解析 ascii2d 网页结果
 *
 * @param {string} html ascii2d HTML
 * @param {string} baseURL ascii2d base URL
 * @returns 画像搜索结果
 */
function getDetail(html, baseURL) {
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
        return {
            thumbnail: baseURL + $box.find('.image-box img').attr('src'),
            title: $title.html(),
            author: $author.html(),
            url: $title.attr('href'),
            author_url: $author.attr('href'),
        };
    }
    return {};
}

function getShareText({ url, title, author, thumbnail, author_url }) {
    if (!url) return '由未知错误导致搜索失败';
    let text = `「${title}」/「${author}」
${CQ.img(thumbnail)}
${pixivShorten(url)}`;
    if (author_url) text += `\nAuthor: ${pixivShorten(author_url)}`;
    return text;
}

/**
 * pixiv 短链接
 *
 * @param {string} url
 * @returns
 */
function pixivShorten(url) {
    let pidSearch = /pixiv.+illust_id=([0-9]+)/.exec(url);
    if (pidSearch) return 'https://pixiv.net/i/' + pidSearch[1];
    let uidSearch = /pixiv.+member\.php\?id=([0-9]+)/.exec(url);
    if (uidSearch) return 'https://pixiv.net/u/' + uidSearch[1];
    return url;
}

export default doSearch;
