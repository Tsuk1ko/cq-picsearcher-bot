/*
 * @Author: JindaiKirin 
 * @Date: 2018-07-10 11:33:14 
 * @Last Modified by: JindaiKirin
 * @Last Modified time: 2018-07-11 16:36:29
 */
import Axios from 'axios';
import Request from 'request';
import Qs from 'querystring';
import config from '../config.json';

const cookies = config.whatanimeCookie;
var cookieI = 0;


/**
 * whatanime搜索
 *
 * @param {string} imgURL
 * @param {boolean} [debug=false]
 * @returns
 */
function doSearch(imgURL, debug = false) {
	var cookieIndex = (cookieI++) % cookies.length; //决定当前使用的cookie
	return getSearchResult(imgURL, cookies[cookieIndex]).then(async ret => {
		if (debug) {
			console.log("[debug] cookie[" + cookieIndex + "]: " + cookies[cookieIndex]);
			console.log(ret);
		}

		var msg = "搜索失败惹 QAQ\n[CQ:image,file=lolico/e.jpg]\n有可能是服务器网络爆炸，请重试一次，如果还是有问题，那可能是：你使用了win10版QQ/有BUG"; //返回信息
		if (!ret) return msg;

		function appendMsg(str) {
			if (typeof (str) == "string" && str.length > 0)
				msg += "\n" + str;
		}

		var quota = ret.quota; //剩余搜索次数
		var expire = ret.expire; //次数重置时间
		if (ret.docs.length == 0) {
			return "当前剩余可搜索次数貌似用光啦！请等待" + expire + "秒后再试！";
		}

		//提取信息
		var doc = ret.docs[0]; //相似度最高的结果
		var diff = 100.0 - doc.diff; //相似度
		diff = diff.toFixed(2);
		var jpName = doc.title_native || ""; //日文名
		var romaName = doc.title_romaji || ""; //罗马音
		var cnName = doc.title_chinese || ""; //中文名
		var posSec = Math.floor(doc.t); //位置：秒
		var posMin = Math.floor(posSec / 60); //位置：分
		posSec %= 60;
		var isR18 = doc.is_adult; //是否R18
		var anilistID = doc.anilist_id; //动漫ID
		var episode = doc.episode || "-"; //集数
		var type, start, end, img, synonyms;

		await getAnimeInfo(anilistID).then(info => {
			type = info.type + " - " + info.format; //类型
			var sd = info.startDate;
			start = sd.year + "-" + sd.month + "-" + sd.day; //开始日期
			var ed = info.endDate;
			end = (ed.year > 0) ? (ed.year + "-" + ed.month + "-" + ed.day) : "";
			img = "[CQ:image,file=" + info.coverImage.large + "]"; //番剧封面图
			synonyms = info.synonyms_chinese || []; //别名

			//构造返回信息
			msg = "[" + diff + "%] 该截图出自第" + episode + "集的" + (posMin < 10 ? "0" : "") + posMin + ":" + (posSec < 10 ? "0" : "") + posSec;
			if (quota <= 10) {
				appendMsg("cookie[" + cookieIndex + "]：注意，" + expire + "秒内搜索次数仅剩" + quota + "次");
			}
			appendMsg(img);
			appendMsg(romaName);
			appendMsg(jpName);
			appendMsg(cnName);
			if (synonyms.length > 0) {
				var syn = "别名：“" + synonyms[0] + "”";
				for (var i = 1; i < synonyms.length; i++)
					syn += "、“" + synonyms[i] + "”";
				appendMsg(syn);
			}
			appendMsg("类型：" + type);
			appendMsg("开播：" + start);
			if (end.length > 0) appendMsg("完结：" + end);
			if (isR18) appendMsg("R18注意！");
		});

		return msg;
	});
}


/**
 * 取得搜番结果
 *
 * @param {string} imgURL 图片地址
 * @param {string} cookie Cookie
 * @returns Prased JSON
 */
async function getSearchResult(imgURL, cookie) {
	var json;
	//取得whatanime返回json
	await Axios.get(imgURL, {
		responseType: 'arraybuffer' //为了转成base64
	}).then(async ret => {
		await new Promise((resolve, reject) => {
			//由于axios无法自定义UA会被block，因此使用request
			Request.post("https://whatanime.ga/search", {
				headers: {
					"accept": 'application/json, text/javascript, */*; q=0.01',
					"accept-language": "zh-CN,zh;q=0.9,zh-TW;q=0.8,en;q=0.7",
					"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
					"cookie": cookie,
					"dnt": 1,
					"origin": "https://whatanime.ga",
					"referer": "https://whatanime.ga/",
					"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
					"x-requested-with": "XMLHttpRequest"
				},
				body: Qs.stringify({
					data: new Buffer(ret.data, 'binary').toString('base64'),
					filter: "",
					trial: 2
				})
			}, (err, res, body) => {
				if (err) {
					reject();
					return;
				}
				json = JSON.parse(body);
				resolve();
			});
		});
	});

	return json;
}


/**
 * 取得番剧信息
 *
 * @param {number} anilistID
 * @returns Prased JSON
 */
function getAnimeInfo(anilistID) {
	return new Promise((resolve, reject) => {
		//由于axios无法自定义UA会被block，因此使用request
		Request.get("https://whatanime.ga/info?anilist_id=" + anilistID, {
			headers: {
				"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36",
			}
		}, (err, res, body) => {
			if (err) reject();
			resolve((JSON.parse(body))[0]);
		});
	});
}


export default doSearch;
