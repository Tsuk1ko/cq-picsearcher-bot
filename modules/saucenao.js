/*
 * @Author: JindaiKirin 
 * @Date: 2018-07-09 14:06:30 
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2018-11-20 14:55:40
 */
import Axios from 'axios';
import nhentai from './nhentai';
import CQ from './CQcode'
import config from '../config.json';

const hosts = config.saucenaoHost;
let hostsI = 0;

const snDB = {
	all: 999,
	pixiv: 5,
	danbooru: 9,
	book: 18,
	anime: 21
}

/**
 * saucenao搜索
 *
 * @param {string} imgURL 图片地址
 * @param {string} db 搜索库
 * @param {boolean} [debug=false] 是否调试
 * @returns Promise 返回消息、返回提示
 */
async function doSearch(imgURL, db, debug = false) {
	let hostIndex = (hostsI++) % hosts.length; //决定当前使用的host
	let warnMsg = ""; //返回提示
	let msg = config.picfinder.replys.failed; //返回消息
	let success = false;

	await getSearchResult(hosts[hostIndex], imgURL, db).then(async ret => {
		//如果是调试模式
		if (debug) {
			console.log(`\n[debug] saucenao[${hostIndex}]: ${hosts[hostIndex]}`);
			console.log(JSON.stringify(ret.data));
		}

		//确保回应正确
		if (ret.status == 200 && ret.data && ret.data.results && ret.data.results.length > 0) {
			let result = ret.data.results[0];
			let header = result.header;
			result = result.data;

			let shortRem = header.short_remaining; //短时剩余
			let longRem = header.long_remaining; //长时剩余
			let similarity = header.similarity; //相似度
			let thumbnail = header.thumbnail; //缩略图
			let url = ""; //结果链接
			if (result.ext_urls) {
				url = result.ext_urls[0];
				//如果结果有多个，优先取danbooru
				for (let i = 1; i < result.ext_urls.length; i++) {
					if (result.ext_urls[i].indexOf('danbooru') !== -1)
						url = result.ext_urls[i];
				}
				url = url.replace('http://', 'https://');
			}

			//替换显示
			let pidSearch = /pixiv.+illust_id=([0-9]+)/.exec(url);
			if (pidSearch) url = 'https://pixiv.net/i/' + pidSearch[1];

			let origURL = url.replace('https://', '');
			//如果是yandere得防屏蔽
			if (url.indexOf('yande.re') !== -1)
				url = get301URL(url);
			let title = result.title || ((origURL.indexOf("anidb.net") === -1) ? "搜索结果" : "AniDB"); //标题
			let author = result.member_name || ""; //作者
			let bookName = result.jp_name || ""; //本子名

			if (author.length > 0)
				title = "「" + title + "」/「" + author + "」";

			//剩余搜图次数
			if (longRem < 20)
				warnMsg += CQ.escape(`saucenao[${hostIndex}]：注意，24h内搜图次数仅剩${longRem}次\n`);
			else if (shortRem < 5)
				warnMsg += CQ.escape(`saucenao[${hostIndex}]：注意，24h内搜图次数仅剩${shortRem}次\n`);
			//相似度
			if (similarity < 70)
				warnMsg += CQ.escape(`相似度[${similarity}%]过低，如果这不是你要找的图，那么可能：确实找不到此图/图为原图的局部图/图清晰度太低/搜索引擎尚未同步新图\n`);

			//回复的消息
			msg = CQ.share(url, `[${similarity}%] ${title}`, origURL, thumbnail);

			success = true;

			//如果是本子
			if (bookName.length > 0) {
				await nhentai(bookName).then(res => {
					//有本子搜索结果的话
					if (res.length > 0) {
						origURL = res;
						url = get301URL(origURL);
						msg = CQ.share(url, `[${similarity}%] ${bookName}`, origURL, thumbnail);
					} else {
						success = false;
						warnMsg += CQ.escape("没有在nhentai找到对应的本子_(:3」∠)_\n或者可能是此query因bug而无法在nhentai中获得搜索结果\n");
						msg = CQ.escape(bookName);
					}
				})
			}

			//处理返回提示
			if (warnMsg.length > 0) warnMsg = warnMsg.substring(0, warnMsg.lastIndexOf("\n"));
		}
	}).catch(e=>{
		console.error(`${new Date().toLocaleString()} [error] saucenao[${hostIndex}]\n${e.toString()}`);
		if (e.response.status == 429) msg = `saucenao[${hostIndex}] 搜索次数已达单位时间上限，请稍候再试`;
	});

	if (config.picfinder.debug) console.log(`${new Date().toLocaleString()} [saucenao][${hostIndex}]\n${msg}`);

	return {
		success,
		msg,
		warnMsg
	};
}


/**
 * 取得搜图结果
 *
 * @param {*} host 自定义saucenao的host
 * @param {*} imgURL 欲搜索的图片链接
 * @param {number} [db=999] 搜索库
 * @returns Axios对象
 */
function getSearchResult(host, imgURL, db = 999) {
	return Axios.get('http://' + host + '/search.php', {
		params: {
			db: db,
			output_type: 2,
			numres: 2,
			url: imgURL
		}
	});
}


/**
 * 得到跳转URL
 *
 * @param {string} url 链接
 * @returns 301URL
 */
function get301URL(url) {
	let buffer = new Buffer(url);
	return 'https://h.niconi.app/?bq&u=' + buffer.toString('base64');
}


export default doSearch;

export {
	snDB
}
