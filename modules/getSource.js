/*
 * @Author: Jindai Kirin 
 * @Date: 2019-03-20 00:58:28 
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2019-04-25 22:23:15
 */

import {
	get
} from 'axios';
import Cheerio from 'cheerio';

/**
 * 获取danbooru来源
 *
 * @param {string} url danbooru URL
 * @returns 来源URL
 */
async function danbooru(url) {
	let {
		data
	} = await get(url);
	const $ = Cheerio.load(data);
	return $('#image-container').attr('data-normalized-source');
}

/**
 * 获取konachan来源
 *
 * @param {string} url konachan URL
 * @returns 来源URL
 */
async function konachan(url) {
	let {
		data
	} = await get(url);
	const $ = Cheerio.load(data);
	let source = null;
	$('#stats li').each((i, e) => {
		if (/^Source:/.exec($(e).text())) {
			source = $(e).find('a').attr('href');
		}
	});
	return source;
}

export default {
	danbooru,
	konachan
};
