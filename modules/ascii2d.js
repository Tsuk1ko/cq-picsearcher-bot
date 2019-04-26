/*
 * @Author: Jindai Kirin 
 * @Date: 2019-04-25 22:21:24 
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2019-04-26 13:51:18
 */

import {
	get
} from 'axios';
import Cheerio from 'cheerio';
import CQ from './CQcode';

const baseURL = 'https://ascii2d.net';

/**
 * ascii2d 搜索
 *
 * @param {string} url 图片地址
 * @returns 色合検索 和 特徴検索 结果
 */
async function doSearch(url) {
	let {
		colorURL,
		colorHTML
	} = await get(`${baseURL}/search/url/${encodeURIComponent(url)}`).then(r => ({
		colorURL: r.request.res.responseUrl,
		colorHTML: r.data
	}));
	let bovwURL = colorURL.replace('/color/', '/bovw/');
	let bovwHTML = await get(bovwURL).then(r => r.data);
	return {
		color: 'ascii2d 色合検索\n' + getShareText(getDetail(colorHTML)),
		bovw: 'ascii2d 特徴検索\n' + getShareText(getDetail(bovwHTML))
	};
}

/**
 * 解析 ascii2d 网页结果
 *
 * @param {string} html ascii2d HTML
 * @returns 画像搜索结果
 */
function getDetail(html) {
	const $ = Cheerio.load(html, {
		decodeEntities: false
	});
	let $box = $($('.item-box')[1]);
	let thumbnail = baseURL + $box.find('.image-box img').attr('src');
	let $link = $box.find('.detail-box a');
	let $title = $($link[0]);
	let $author = $($link[1]);
	return {
		thumbnail,
		title: $title.html(),
		author: $author.html(),
		url: $title.attr('href'),
		author_url: $author.attr('href')
	};
}

function getShareText({
	url,
	title,
	author,
	thumbnail,
	author_url
}) {
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
	let uidSearch = /pixiv.+member\.php\?id=([0-9]+)/.exec(author_url);
	if (uidSearch) return 'https://pixiv.net/u/' + uidSearch[1];
	return url;
}

export default doSearch;
