/*
 * @Author: JindaiKirin 
 * @Date: 2018-07-09 20:20:13 
 * @Last Modified by: JindaiKirin
 * @Last Modified time: 2018-07-14 01:51:43
 */
import Axios from 'axios';


/**
 * nhentai搜索
 *
 * @param {string} name 本子名
 * @returns 本子地址
 */
async function doSearch(name) {
	var url = "";
	//搜索
	await getSearchResult(name, true).then(ret => {
		url = ret;
	}).catch(e => {
		console.error("\n[error] nhentai\n" + e);
	});
	//如果搜不到汉化本
	if (url.length === 0) {
		await getSearchResult(name, false).then(ret => {
			url = ret;
		}).catch(e => {
			console.error("\n[error] nhentai\n" + e);
		});
	}
	return url;
}


/**
 * 取得搜本子结果
 *
 * @param {string} name 本子名
 * @param {boolean} getChinese 是否搜索汉化本
 * @returns Axios对象
 */
function getSearchResult(name, getChinese) {
	return Axios.get('https://nhentai.net/search/', {
		params: {
			q: name.replace(/[^ ]*(:|')[^ ]*/g, '') + (getChinese ? " chinese" : "")
		}
	}).then(ret => {
		//检验返回状态
		if (ret.status == 200) {
			var html = ret.data;
			//提取本子URL
			if (html.search(/\/g\/[0-9]+\//) !== -1) {
				var gid = /\/g\/[0-9]+\//.exec(html)[0];
				return "https://nhentai.net" + gid;
			}
		}
		return "";
	});
}


export default doSearch;
