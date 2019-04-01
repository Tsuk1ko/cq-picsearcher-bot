/*
 * @Author: Jindai Kirin 
 * @Date: 2019-04-02 01:34:37 
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2019-04-02 01:47:10
 */

import {
	get
} from 'axios';
import Cheerio from 'cheerio';

/**
 * 获取konachan来源
 *
 * @param {string} url konachan URL
 * @returns 来源URL
 */
async function getSource(url) {
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

export default getSource;
