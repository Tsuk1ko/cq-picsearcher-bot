/*
 * @Author: JindaiKirin 
 * @Date: 2018-07-09 20:20:13 
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2019-03-20 00:49:39
 */

import NHentaiAPI from 'nhentai-api-js';

const Api = new NHentaiAPI();

/**
 * nhentai搜索
 *
 * @param {string} name 本子名
 * @returns 本子信息
 */
async function doSearch(name) {
	let json = await Api.search(`"${name}" chinese`);
	if (json.results.length == 0) json = await Api.search(`"${name}"`);
	if (json.results.length == 0) return false;
	return json.results[0];
}


export default doSearch;
