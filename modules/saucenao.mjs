/*
 * @Author: JindaiKirin 
 * @Date: 2018-07-09 14:06:30 
 * @Last Modified by: JindaiKirin
 * @Last Modified time: 2018-07-11 17:14:17
 */
import Axios from 'axios';
import nhentai from './nhentai';
import config from '../config.json';

const hosts = config.saucenaoHost;
var hostsI = 0;

/**
 * saucenao搜索
 *
 * @param {string} imgURL 图片地址
 * @param {string} params 参数（包含参数的消息）
 * @returns Promise 返回消息、返回提示
 */
async function doSearch(imgURL, params) {
	//根据命令指定图库
	function hasCommand(cmd) {
		return params.search("--" + cmd) !== -1;
	}
	var db = 999;
	if (hasCommand("pixiv")) db = 5;
	else if (hasCommand("danbooru")) db = 9;
	else if (hasCommand("book")) db = 18;
	else if (hasCommand("anime")) db = 21;

	var hostIndex = (hostsI++) % hosts.length; //决定当前使用的host
	var warnMsg = ""; //返回提示
	var msg = "搜索失败惹 QAQ\n[CQ:image,file=lolico/e.jpg]\n有可能是服务器网络爆炸，请重试一次，如果还是有问题，那可能是：你使用了win10版QQ/有BUG"; //返回消息

	await getSearchResult(hosts[hostIndex], imgURL, db).then(async ret => {
		//如果是调试模式
		if (hasCommand("debug")) {
			console.log("[debug] host[" + hostIndex + "]: " + hosts[hostIndex]);
			console.log(JSON.stringify(ret));
		}

		//确保回应正确
		if (ret.status == 200 && ret.data.results.length > 0) {
			var result = ret.data.results[0];
			var header = result.header;
			result = result.data;

			var shortRem = header.short_remaining; //短时剩余
			var longRem = header.long_remaining; //长时剩余
			var similarity = header.similarity; //相似度
			var thumbnail = header.thumbnail; //缩略图
			var url = ""; //结果链接
			if (result.ext_urls) {
				url = result.ext_urls[0];
				//如果结果有多个，优先取danbooru
				for (var i = 1; i < result.ext_urls.length; i++) {
					if (result.ext_urls[i].indexOf('danbooru') !== -1)
						url = result.ext_urls[i];
				}
				url = url.replace('http://', 'https://');
			}
			var origURL = url;
			//如果是yandere得防屏蔽
			if (url.indexOf('yande.re') !== -1)
				url = get301URL(url);
			var title = result.title || "搜索结果"; //标题
			var author = result.author || ""; //作者
			var bookName = result.jp_name || ""; //本子名

			if (author.length > 0)
				title = "「" + title + "」/「" + author + "」";

			//剩余搜图次数
			if (longRem < 20)
				warnMsg += "host[" + hostIndex + "]：注意，24h内搜图次数仅剩" + longRem + "次\n";
			else if (shortRem < 5)
				warnMsg += "host[" + hostIndex + "]：注意，30s内搜图次数仅剩" + shortRem + "次\n";
			//相似度
			if (similarity < 70)
				warnMsg += "相似度[" + similarity + "%]过低，如果这不是你要找的图，那么可能：确实找不到此图/图为原图的局部图/图清晰度太低/搜索引擎尚未同步新图\n";

			//回复的消息
			msg = getShareCQ(url, "[" + similarity + "%]" + title, origURL, thumbnail);
			console.log("搜图：" + msg);

			//如果是本子
			if (bookName.length > 0) {
				await nhentai(bookName).then(res => {
					//有本子搜索结果的话
					if (res.length > 0) {
						origURL = res;
						url = get301URL(origURL);
						msg = getShareCQ(url, "[" + similarity + "%]" + bookName, origURL, thumbnail);
					} else {
						warnMsg += "没有在nhentai找到对应的本子_(:3」∠)_\n或者可能是此query因bug而无法在nhentai中获得搜索结果\n";
						msg = bookName;
					}
				})
			}
		}

		//处理返回提示
		if (warnMsg.length > 0)
			warnMsg = warnMsg.substring(0, warnMsg.lastIndexOf("\n"));
	});
	return {
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
	return Axios.get('https://' + host + '/search.php', {
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
	var buffer = new Buffer(url);
	return 'https://h.niconi.app/?bq&u=' + buffer.toString('base64');
}


/**
 * CQ码 分享链接
 *
 * @param {string} url 链接
 * @param {string} title 标题
 * @param {string} content 内容
 * @param {string} image 图片URL
 * @returns
 */
function getShareCQ(url, title, content, image) {
	return "[CQ:share,url=" + url + ",title=" + title + ",content=" + content + ",image=" + image + "]";
}


export default doSearch;
