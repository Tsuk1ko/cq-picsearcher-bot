/*
 * @Author: JindaiKirin 
 * @Date: 2018-07-09 10:52:50 
 * @Last Modified by: JindaiKirin
 * @Last Modified time: 2018-07-24 10:28:00
 */
import CQWebsocket from './node-cq-websocket';
import config from './config.json';
import saucenao from './modules/saucenao';
import {
	snDB
} from './modules/saucenao'
import whatanime from './modules/whatanime'
import CQ from './modules/CQcode'
import Pfsql from './modules/pfsql'
import Logger from './modules/Logger'


//数据库初始化
Pfsql.sqlInitialize();


//常用变量
let setting = config.picfinder;
let searchModeOnReg = new RegExp(setting.regs.searchModeOn);
let searchModeOffReg = new RegExp(setting.regs.searchModeOff);
let signReg = new RegExp(setting.regs.sign);
let addGroupReg = /--add-group=([0-9]+)/;


let bot = new CQWebsocket(config);
let logger = new Logger();


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
		//检索指令
		let search = addGroupReg.exec(context.message);
		if (search) {
			replyMsg(context, "将会同意进入群" + search[1] + "的群邀请");
			//注册一次性监听器
			bot.once('request.group.invite', (context2) => {
				if (context2.group_id == search[1]) {
					bot('set_group_add_request', {
						flag: context2.flag,
						type: "invite",
						approve: true
					});
					replyMsg(context, "已进入群" + context2.group_id);
					return true;
				}
				return false;
			});
		}
	}
});


//连接相关监听
bot.on('socket.connecting', function (wsType, attempts) {
	console.log(new Date().toLocaleString() + ' 连接中[%s]#%d', wsType, attempts)
}).on('socket.connect', function (wsType, sock, attempts) {
	console.log(new Date().toLocaleString() + ' 连接成功[%s]#%d', wsType, attempts);
	if (setting.admin > 0) {
		bot('send_private_msg', {
			user_id: setting.admin,
			message: "已上线"
		});
	}
}).on('socket.failed', function (wsType, attempts) {
	console.log(new Date().toLocaleString() + ' 连接失败[%s]#%d', wsType, attempts)
})



bot.connect();





//私聊以及群组@的处理
function privateAndAtMsg(e, context) {
	if (hasImage(context.message)) {
		//搜图
		e.cancel();
		searchImg(context);
	} else if (signReg.exec(context.message)) {
		//签到
		e.cancel();
		if (logger.canSign(context.user_id)) {
			bot('send_like', {
				user_id: context.user_id,
				times: 10
			});
			return setting.replys.sign;
		} else return setting.replys.signed;
	} else if (context.message.search("--") === -1) {
		//其他指令
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
	let group = context.group_id;
	let user = context.user_id;

	if (searchModeOnReg.exec(context.message)) {
		//进入搜图
		e.cancel();
		if (logger.smSwitch(group, user, true))
			replyMsg(context, CQ.at(user) + setting.replys.searchModeOn);
		else
			replyMsg(context, CQ.at(user) + setting.replys.searchModeAlreadyOn);
	} else if (searchModeOffReg.exec(context.message)) {
		e.cancel();
		//退出搜图
		if (logger.smSwitch(group, user, false))
			replyMsg(context, CQ.at(user) + setting.replys.searchModeOff)
		else
			replyMsg(context, CQ.at(user) + setting.replys.searchModeAlreadyOff);
	}

	//搜图模式检测
	let smStatus = logger.smStatus(group, user);
	if (smStatus) {
		//获取搜图模式下的搜图参数
		function getDB() {
			let cmd = /^(all|pixiv|danbooru|book|anime)$/.exec(context.message);
			if (cmd) return snDB[cmd[1]] || -1;
			return -1;
		}

		//切换搜图模式
		let cmdDB = getDB();
		if (cmdDB !== -1) {
			logger.smSetDB(group, user, cmdDB);
			smStatus = cmdDB;
			replyMsg(context, "已切换至[" + context.message + "]搜图模式√")
		}
		//有图片则搜图
		if (hasImage(context.message)) {
			e.cancel();
			searchImg(context, smStatus);
		}
	} else if (setting.repeat.enable) { //复读（
		//随机复读，rptLog得到当前复读次数
		if (logger.rptLog(group, user, context.message) >= setting.repeat.times && Math.random() * 100 <= setting.repeat.probability) {
			logger.rptDone(group);
			//延迟2s后复读
			setTimeout(() => {
				replyMsg(context, context.message);
			}, 2000);
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
	let msg = context.message;
	let imgs = getImgs(msg);
	for (let img of imgs) {
		if (hasCommand("get-url")) replyMsg(context, img.url);
		else {
			//决定搜索库
			let db = snDB.all;
			if (customDB === -1) {
				if (hasCommand("pixiv")) db = snDB.pixiv;
				else if (hasCommand("danbooru")) db = snDB.danbooru;
				else if (hasCommand("book")) db = snDB.book;
				else if (hasCommand("anime")) db = snDB.anime;
			} else db = customDB;

			//获取缓存
			let hasCache = false;
			let runCache = Pfsql.isEnable() && !hasCommand("purge");
			if (runCache) {
				let sql = new Pfsql();
				let cache = false;
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
				if (!logger.canSearch(context.user_id, setting.searchLimit)) {
					replyMsg(context, setting.replys.personLimit);
					return;
				}
				//开始搜索
				saucenao(img.url, db, hasCommand("debug")).then(async ret => {
					replyMsg(context, ret.msg);
					replyMsg(context, ret.warnMsg);
					//如果需要缓存
					let needCacheMsgs;
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
						let sql = new Pfsql();
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
	let reg = /\[CQ:image,file=([^,]+),url=([^\]]+)\]/g;
	let result = [];
	let search = reg.exec(msg);
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
