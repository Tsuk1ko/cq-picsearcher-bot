/*
 * @Author: JindaiKirin 
 * @Date: 2018-07-09 10:52:50 
 * @Last Modified by: JindaiKirin
 * @Last Modified time: 2018-07-16 11:07:14
 */
import CQWebsocket from './node-cq-websocket';
import config from './config.json';
import saucenao from './modules/saucenao';
import whatanime from './modules/whatanime'
import CQ from './modules/CQcode'
import Pfsql from './modules/pfsql'
import {
	snDB
} from './modules/saucenao'


Pfsql.sqlInitialize();


var searchMode = []; //搜图模式
var repeater = []; //复读记录
var addGroup = []; //进群请求
var searchCount = []; //搜索次数统计

var setting = config.picfinder;
var searchModeOnReg = new RegExp(setting.searchMode.onReg);
var searchModeOffReg = new RegExp(setting.searchMode.offReg);
var addGroupReg = /--add-group=([0-9]+)/;


let bot = new CQWebsocket(config);


//设置监听器
if (setting.debug) {
	//私聊
	bot.on('message.private', debugRrivateAndAtMsg);
	//讨论组@
	bot.on('message.discuss.@me', debugRrivateAndAtMsg);
	//群组@
	bot.on('message.group.@me', debugRrivateAndAtMsg);
} else {
	//私聊
	bot.on('message.private', privateAndAtMsg);
	//讨论组@
	bot.on('message.discuss.@me', privateAndAtMsg);
	//群组@
	bot.on('message.group.@me', privateAndAtMsg);
	//群组
	bot.on('message.group', groupMsg);
}



//好友请求
bot.on('request.friend', (context) => {
	bot('set_friend_add_request', {
		flag: context.flag,
		approve: setting.autoAddFriend
	});
});
//进群邀请
bot.on('message.private', (e, context) => {
	if (context.user_id == setting.admin) {
		var search = addGroupReg.exec(context.message);
		if (search) {
			addGroup[search[1]] = true;
			replyMsg(context, "将会同意进入群" + search[1] + "的群邀请");
		}
	}
});
bot.on('request.group.invite', (context) => {
	if (setting.autoAddGroup || addGroup[context.group_id]) {
		addGroup[context.group_id] = false;
		bot('set_group_add_request', {
			flag: context.flag,
			type: "invite",
			approve: true
		});
		bot('send_private_msg', {
			user_id: setting.admin,
			message: "已进入群" + context.group_id
		});
	}
});



bot.on('socket.connecting', function (wsType, attempts) {
	console.log('连接中[%s][%d]', wsType, attempts)
}).on('socket.connect', function (wsType, sock, attempts) {
	console.log('连接成功[%s][%d]', wsType, attempts)
}).on('socket.failed', function (wsType, attempts) {
	console.log('连接失败[%s][%d]', wsType, attempts)
})



bot.connect();





//私聊以及群组@的处理
function privateAndAtMsg(e, context) {
	if (hasImage(context.message)) {
		e.cancel();
		searchImg(context);
	} else if (context.message.search("--") === -1) {
		return setting.replys.default;
	}
}
//调试模式
function debugRrivateAndAtMsg(e, context) {
	if (context.user_id != setting.admin) {
		e.cancel();
		return setting.replys.debug;
	} else {
		privateAndAtMsg(e, context);
	}
}
//群组消息处理
function groupMsg(e, context) {
	//进入或退出搜图模式
	var group = context.group_id;
	var qq = context.user_id;
	if (!searchMode[group]) searchMode[group] = []; //组索引
	if (searchModeOnReg.exec(context.message)) {
		//进入搜图
		e.cancel();
		if (searchMode[group][qq] && searchMode[group][qq].enable)
			replyMsg(context, CQ.at(qq) + setting.searchMode.alreadyOn);
		else {
			replyMsg(context, CQ.at(qq) + setting.searchMode.on);
			searchMode[group][qq] = {
				enable: true,
				db: snDB.all
			};
		}
	} else if (searchModeOffReg.exec(context.message)) {
		//退出搜图
		e.cancel();
		if (searchMode[group][qq] && searchMode[group][qq].enable) {
			replyMsg(context, CQ.at(qq) + setting.searchMode.off)
			searchMode[group][qq].enable = false;
		} else replyMsg(context, CQ.at(qq) + setting.searchMode.alreadyOff);
	}

	//搜图模式检测
	if (searchMode[group][qq] && searchMode[group][qq].enable) {
		if (hasImage(context.message)) {
			e.cancel();
			searchImg(context, searchMode[group][qq].db);
		} else {
			function getDB() {
				var cmd = /^(all|pixiv|danbooru|book|anime)$/.exec(context.message);
				if (cmd) return snDB[cmd[1]] || -1;
				return -1;
			}
			var cmdDB = getDB();
			if (cmdDB !== -1) {
				searchMode[group][qq].db = cmdDB;
				replyMsg(context, "已切换至[" + context.message + "]搜图模式√")
			}
		}
	} else if (setting.repeat.enable) { //复读（
		//检查复读记录
		if (repeater[group]) {
			if (repeater[group].msg == context.message) {
				//同一个人不算复读
				if (repeater[group].qq != qq) {
					repeater[group].times++;
					repeater[group].qq = qq;
				}
			} else {
				repeater[group] = {
					qq: qq,
					msg: context.message,
					times: 1,
					done: false
				};
			}
		} else {
			repeater[group] = {
				qq: qq,
				msg: context.message,
				times: 1,
				done: false
			};
		}
		//随机复读
		if (!repeater[group].done && repeater[group].times >= setting.repeat.times && Math.random() * 100 <= setting.repeat.probability) {
			repeater[group].done = true;
			setTimeout(() => {
				replyMsg(context, context.message);
			}, 1500);
		}
	}
}


/**
 * 搜图
 *
 * @param {object} context
 * @param {number} [customDB=-1]
 * @returns
 */
async function searchImg(context, customDB = -1) {
	//提取参数
	function hasCommand(cmd) {
		return context.message.search("--" + cmd) !== -1;
	}

	//得到图片链接并搜图
	var msg = context.message;
	var imgs = getImgs(msg);
	for (let img of imgs) {
		if (hasCommand("get-url")) replyMsg(context, img.url);
		else {
			//决定搜索库
			var db = snDB.all;
			if (customDB === -1) {
				if (hasCommand("pixiv")) db = snDB.pixiv;
				else if (hasCommand("danbooru")) db = snDB.danbooru;
				else if (hasCommand("book")) db = snDB.book;
				else if (hasCommand("anime")) db = snDB.anime;
			} else db = customDB;

			//获取缓存
			var hasCache = false;
			var runCache = Pfsql.isEnable() && !hasCommand("purge");
			if (runCache) {
				var sql = new Pfsql();
				var cache = false;
				await sql.getCache(img.file, db).then(ret => {
					cache = ret;
				});
				sql.close();
				//如果有缓存
				if (cache) {
					hasCache = true;
					for (let cmsg of cache) {
						if (cmsg.indexOf('[CQ:share') !== -1) {
							cmsg = cmsg.replace('content=', 'content=&#91;缓存&#93; ');
						} else if (cmsg.indexOf('WhatAnime') !== -1) {
							cmsg = cmsg.replace('&#91;', '&#91;缓存&#93; &#91;');
						}
						replyMsg(context, cmsg);
					}
				}
			}
			
			if (!hasCache) {
				//检查搜图次数
				if (!searchCount[context.user_id]) {
					searchCount[context.user_id] = 0;
				}
				if (searchCount[context.user_id]++ >= 30) {
					replyMsg(context, setting.replys.personLimit);
					return;
				}
				//开始搜索
				saucenao(img.url, db, hasCommand("debug")).then(async ret => {
					replyMsg(context, ret.msg);
					replyMsg(context, ret.warnMsg);
					//如果需要缓存
					var needCacheMsgs;
					if (Pfsql.isEnable()) {
						needCacheMsgs = [];
						if (ret.msg.length > 0) needCacheMsgs.push(ret.msg);
						if (ret.warnMsg.length > 0) needCacheMsgs.push(ret.warnMsg);
					}
					if (db == 21 || ret.msg.indexOf("anidb.net") !== -1) {
						//搜番
						await whatanime(img.url, hasCommand("debug")).then(wamsg => {
							replyMsg(context, wamsg);
							if (Pfsql.isEnable() && wamsg.length > 0) needCacheMsgs.push(wamsg);
						});
					}
					//将需要缓存的信息写入数据库
					if (Pfsql.isEnable()) {
						var sql = new Pfsql();
						await sql.addCache(img.file, db, needCacheMsgs);
						sql.close();
					}
				});
			}
		}
	}
}


/**
 * 从消息中提取图片
 *
 * @param {string} msg
 * @returns 图片URL数组
 */
function getImgs(msg) {
	var reg = /\[CQ:image,file=([^,]+),url=([^\]]+)\]/g;
	var result = [];
	var search = reg.exec(msg);
	while (search) {
		result.push({
			file: search[1],
			url: search[2]
		});
		search = reg.exec(msg);
	}
	return result;
}


/**
 * 判断消息是否有图片
 *
 * @param {string} msg 消息
 * @returns 有则返回true
 */
function hasImage(msg) {
	return msg.indexOf("[CQ:image") !== -1;
}


/**
 * 回复消息
 *
 * @param {object} context 消息对象
 * @param {string} msg 回复内容
 */
function replyMsg(context, msg) {
	if (typeof (msg) != "string" || !msg.length > 0) return;
	if (context.group_id) {
		bot('send_group_msg', {
			group_id: context.group_id,
			message: msg
		});
	} else if (context.discuss_id) {
		bot('send_discuss_msg', {
			discuss_id: context.discuss_id,
			message: msg
		});
	} else if (context.user_id) {
		bot('send_private_msg', {
			user_id: context.user_id,
			message: msg
		});
	}
}
