/*
 * @Author: Jindai Kirin 
 * @Date: 2019-03-20 00:58:28 
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2019-03-20 01:16:07
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
async function getSource(url) {
	let {
		data
	} = await get(url);
	const $ = Cheerio.load(data);
	return $('#image-container').attr('data-normalized-source');
}

export default getSource;
