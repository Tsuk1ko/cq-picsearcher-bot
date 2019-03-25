/*
 * @Author: JindaiKirin 
 * @Date: 2018-07-09 10:52:50 
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2019-03-26 03:21:24
 */
import CQWebsocket from 'cq-websocket';
import config from './modules/config';
import saucenao from './modules/saucenao';
import {
	snDB
} from './modules/saucenao';
import whatanime from './modules/whatanime';
import CQ from './modules/CQcode';
import Pfsql from './modules/pfsql';
import Logger from './modules/Logger';
import RandomSeed from 'random-seed';
import sendSetu from './modules/plugin/setu';
import ocr from './modules/plugin/ocr';

//初始化
Pfsql.sqlInitialize();


//常量
const setting = config.picfinder;
const rand = RandomSeed.create();
const searchModeOnReg = new RegExp(setting.regs.searchModeOn);
const searchModeOffReg = new RegExp(setting.regs.searchModeOff);
const signReg = new RegExp(setting.regs.sign);
const addGroupReg = /--add-group=([0-9]+)/;
const banReg = /--ban-([ug])=([0-9]+)/;


let bot = new CQWebsocket(config);
let logger = new Logger();


//好友请求
bot.on('request.friend', context => {
	let approve = setting.autoAddFriend;
	let answers = setting.addFriendAnswers;
	if (approve && answers.length > 0) {
		let comments = context.comment.split('\n');
		try {
			answers.forEach((ans, i) => {
				let a = /(?<=回答:).*/.exec(comments[i * 2 + 1])[0];
				if (ans != a) approve = false;
			});
		} catch (e) {
			console.error(e);
			approve = false;
		}
	}
	if (approve) bot('set_friend_add_request', {
		flag: context.flag,
		sub_type: 'invite',
		approve: true
	});
});

//加群请求
bot.on('request.group.invite', context => {
	if (setting.autoAddGroup) bot('set_group_add_request', {
		flag: context.flag,
		approve: true
	});
});

//管理员指令
bot.on('message.private', (e, context) => {
	if (context.user_id == setting.admin) {
		//允许加群
		let search = addGroupReg.exec(context.message);
		if (search) {
			replyMsg(context, `将会同意进入群${search[1]}的群邀请`);
			//注册一次性监听器
			bot.once('request.group.invite', (context2) => {
				if (context2.group_id == search[1]) {
					bot('set_group_add_request', {
						flag: context2.flag,
						type: "invite",
						approve: true
					});
					replyMsg(context, `已进入群${context2.group_id}`);
					return true;
				}
				return false;
			});
			return;
		}

		//停止程序（利用pm2重启）
		if (context.message == '--shutdown') process.exit();

		//Ban
		search = banReg.exec(context.message);
		if (search) {
			Logger.ban(search[1], parseInt(search[2]));
			replyMsg(context, `已封禁${search[1]=='u'?'用户':'群组'}${search[1]}`);
			return;
		}
	}
});


//设置监听器
if (setting.debug) {
	//私聊
	bot.on('message.private', debugRrivateAndAtMsg);
	//讨论组@
	//bot.on('message.discuss.@me', debugRrivateAndAtMsg);
	//群组@
	bot.on('message.group.@me', debugRrivateAndAtMsg);
} else {
	//私聊
	bot.on('message.private', privateAndAtMsg);
	//讨论组@
	//bot.on('message.discuss.@me', privateAndAtMsg);
	//群组@
	bot.on('message.group.@me', privateAndAtMsg);
	//群组
	bot.on('message.group', groupMsg);
}


//连接相关监听
bot.on('socket.connecting', (wsType, attempts) => console.log(`${getTime()} 连接中[${wsType}]#${attempts}`))
	.on('socket.failed', (wsType, attempts) => console.log(`${getTime()} 连接失败[${wsType}]#${attempts}`))
	.on('socket.error', (wsType, err) => console.log(`${getTime()} 连接错误[${wsType}]#${attempts}`))
	.on('socket.connect', (wsType, sock, attempts) => {
		console.log(`${getTime()} 连接成功[${wsType}]#${attempts}`);
		if (setting.admin > 0) {
			setTimeout(() => {
				bot('send_private_msg', {
					user_id: setting.admin,
					message: `已上线[${wsType}]#${attempts}`
				});
			}, 5000);
		}
	});


//connect
bot.connect();


//自动帮自己签到（诶嘿
setInterval(() => {
	if (bot.isReady() && logger.canAdminSign()) {
		setTimeout(() => {
			if (setting.admin > 0) {
				bot('send_like', {
					user_id: setting.admin,
					times: 10
				});
			}
		}, 60 * 1000);
	}
}, 60 * 60 * 1000);



//通用处理
function commonHandle(e, context) {
	//黑名单检测
	if (Logger.checkBan(context.user_id, context.group_id)) return false;

	//兼容其他机器人
	let startChar = context.message.charAt(0);
	if (startChar == '/' || startChar == '<') return false;

	//setu
	if (setting.setu.enable) {
		if (sendSetu(context, replyMsg, logger, bot)) return false;
	}

	return true;
}


//私聊以及群组@的处理
function privateAndAtMsg(e, context) {
	if (!commonHandle(e, context)) return;

	if (hasImage(context.message)) {
		//搜图
		e.stopPropagation();
		searchImg(context);
	} else if (signReg.exec(context.message)) {
		//签到
		e.stopPropagation();
		if (logger.canSign(context.user_id)) {
			bot('send_like', {
				user_id: context.user_id,
				times: 10
			});
			return setting.replys.sign;
		} else return setting.replys.signed;
	} else if (context.message.search("--") !== -1) {
		return;
	} else if (!context.group_id && !context.discuss_id) {
		let db = snDB[context.message];
		if (db) {
			logger.smSwitch(0, context.user_id, true);
			logger.smSetDB(0, context.user_id, db);
			return `已临时切换至[${context.message}]搜图模式√`;
		} else return setting.replys.default;
	} else {
		//其他指令
		return setting.replys.default;
	}
}

//调试模式
function debugRrivateAndAtMsg(e, context) {
	if (context.user_id != setting.admin) {
		e.stopPropagation();
		return setting.replys.debug;
	} else {
		privateAndAtMsg(e, context);
	}
}

//群组消息处理
function groupMsg(e, context) {
	if (!commonHandle(e, context)) return;

	//进入或退出搜图模式
	let {
		group_id,
		user_id
	} = context;

	if (searchModeOnReg.exec(context.message)) {
		//进入搜图
		e.stopPropagation();
		if (logger.smSwitch(group_id, user_id, true, () => {
				replyMsg(context, setting.replys.searchModeTimeout, true);
			})) replyMsg(context, setting.replys.searchModeOn, true);
		else replyMsg(context, setting.replys.searchModeAlreadyOn, true);
	} else if (searchModeOffReg.exec(context.message)) {
		e.stopPropagation();
		//退出搜图
		if (logger.smSwitch(group_id, user_id, false))
			replyMsg(context, setting.replys.searchModeOff, true);
		else
			replyMsg(context, setting.replys.searchModeAlreadyOff, true);
	}

	//搜图模式检测
	let smStatus = logger.smStatus(group_id, user_id);
	if (smStatus) {
		//获取搜图模式下的搜图参数
		let getDB = () => {
			let cmd = /^(all|pixiv|danbooru|book|anime)$/.exec(context.message);
			if (cmd) return snDB[cmd[1]] || -1;
			return -1;
		};

		//切换搜图模式
		let cmdDB = getDB();
		if (cmdDB !== -1) {
			logger.smSetDB(group_id, user_id, cmdDB);
			smStatus = cmdDB;
			replyMsg(context, `已切换至[${context.message}]搜图模式√`);
		}

		//有图片则搜图
		if (hasImage(context.message)) {
			//刷新搜图TimeOut
			logger.smSwitch(group_id, user_id, true, () => {
				replyMsg(context, setting.replys.searchModeTimeout, true);
			});
			e.stopPropagation();
			searchImg(context, smStatus);
		}
	} else if (setting.repeat.enable) { //复读（
		//随机复读，rptLog得到当前复读次数
		if (logger.rptLog(group_id, user_id, context.message) >= setting.repeat.times && getRand() <= setting.repeat.probability) {
			logger.rptDone(group_id);
			//延迟2s后复读
			setTimeout(() => {
				replyMsg(context, context.message);
			}, 2000);
		} else if (getRand() <= setting.repeat.commonProb) { //平时发言下的随机复读
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

	//OCR
	if (hasCommand('ocr')) {
		doOCR(context);
		return;
	}

	//决定搜索库
	let db = snDB.all;
	if (customDB === -1) {
		if (hasCommand("pixiv")) db = snDB.pixiv;
		else if (hasCommand("danbooru")) db = snDB.danbooru;
		else if (hasCommand("book")) db = snDB.book;
		else if (hasCommand("anime")) db = snDB.anime;
		else if (!context.group_id && !context.discuss_id) {
			//私聊搜图模式
			let sdb = logger.smStatus(0, context.user_id);
			if (sdb) {
				db = sdb;
				logger.smSwitch(0, context.user_id, false);
			}
		}
	} else db = customDB;

	//得到图片链接并搜图
	let msg = context.message;
	let imgs = getImgs(msg);
	for (let img of imgs) {
		if (hasCommand("get-url")) replyMsg(context, img.url.replace(/\/[0-9]+\//, '//').replace(/\?.*$/, ''));
		else {
			//获取缓存
			let hasCache = false;
			let runCache = Pfsql.isEnable() && !hasCommand("purge");
			if (runCache) {
				let sql = new Pfsql();
				let cache = await sql.getCache(img.file, db);
				sql.close();

				//如果有缓存
				if (cache) {
					hasCache = true;
					for (let cmsg of cache) {
						cmsg = `${cmsg}`;
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
				let ret = await saucenao(img.url, db, hasCommand("debug"));
				let success = ret.success; //如果有未成功的则不缓存

				replyMsg(context, ret.msg);
				replyMsg(context, ret.warnMsg);

				//如果需要缓存
				let needCacheMsgs;
				if (Pfsql.isEnable()) {
					needCacheMsgs = [];
					if (ret.msg.length > 0) needCacheMsgs.push(ret.msg);
				}

				//搜番
				if (db == 21 || ret.msg.indexOf("anidb.net") !== -1) {
					let waRet = await whatanime(img.url, hasCommand("debug"));
					if (!waRet.success) success = false; //如果搜番有误也视作不成功
					replyMsg(context, waRet.msg);
					if (Pfsql.isEnable() && waRet.msg.length > 0) needCacheMsgs.push(waRet.msg);
				}

				//将需要缓存的信息写入数据库
				if (Pfsql.isEnable() && success) {
					let sql = new Pfsql();
					await sql.addCache(img.file, db, needCacheMsgs);
					sql.close();
				}
			}
		}
	}
}


function doOCR(context) {
	let msg = context.message;
	let imgs = getImgs(msg);
	let lang = null;
	let langSearch = /(?<=--lang=)[a-zA-Z]{2,3}/.exec(msg);
	if (langSearch) lang = langSearch[0];
	for (let img of imgs) {
		ocr(img.url, lang).then(ret => replyMsg(context, ret.text)).catch(e => {
			replyMsg(context, 'OCR识别发生错误');
			console.error(`${new Date().toLocaleString()} [error] OCR`);
			console.error(e);
		});
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
 * @param {boolean} at 是否at发送者
 */
function replyMsg(context, msg, at = false) {
	if (typeof (msg) != "string" || msg.length == 0) return;
	if (context.group_id) {
		return bot('send_group_msg', {
			group_id: context.group_id,
			message: at ? CQ.at(context.user_id) + msg : msg
		});
	} else if (context.discuss_id) {
		return bot('send_discuss_msg', {
			discuss_id: context.discuss_id,
			message: at ? CQ.at(context.user_id) + msg : msg
		});
	} else if (context.user_id) {
		return bot('send_private_msg', {
			user_id: context.user_id,
			message: msg
		});
	}
}


/**
 * 生成随机浮点数
 *
 * @returns 0到100之间的随机浮点数
 */
function getRand() {
	return rand.floatBetween(0, 100);
}

function getTime() {
	return new Date().toLocaleString();
}
