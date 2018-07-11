/*
 * @Author: JindaiKirin 
 * @Date: 2018-07-09 10:52:50 
 * @Last Modified by: JindaiKirin
 * @Last Modified time: 2018-07-11 19:07:36
 */
import CQWebsocket from './node-cq-websocket';
import config from './config.json';
import saucenao from './modules/saucenao';
import whatanime from './modules/whatanime'
import CQ from './modules/CQcode'


var searchModel = []; //搜图模式
var repeater = []; //复读记录
var addGroup = []; //进群请求

var setting = config.picfinder;
var searchModelOnReg = /竹竹搜[图圖]/;
var searchModelOffReg = /[谢謝]+竹竹/;
var addGroupReg = /--add-group=([0-9]+)/;


let bot = new CQWebsocket(config);

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
	bot.on('message.group', (e, context) => {
		//进入或退出搜图模式
		var qq = context.user_id;
		if (searchModelOnReg.exec(context.message)) {
			e.cancel();
			if (searchModel[qq]) replyMsg(context, CQ.at(qq) + setting.searchModel.alreadyOn);
			else {
				replyMsg(context, CQ.at(qq) + setting.searchModel.on);
				searchModel[qq] = true;
			}
		} else if (searchModelOffReg.exec(context.message)) {
			e.cancel();
			if (searchModel[qq]) {
				replyMsg(context, CQ.at(qq) + setting.searchModel.off)
			} else replyMsg(context, CQ.at(qq) + setting.searchModel.alreadyOff);
		}
		//搜图模式检测
		if (searchModel[qq] && hasImage(context.message)) {
			e.cancel();
			searchImg(context);
		} else if (setting.repeat.switch) { //复读（
			var group = context.group_id;
			//检查复读记录
			if (repeater[group]) {
				if (repeater[group].msg == context.message) repeater[group].times++;
				else {
					repeater[group] = {
						msg: context.message,
						times: 1,
						done: false
					};
				}
			} else {
				repeater[group] = {
					msg: context.message,
					times: 1,
					done: false
				};
			}
			//随机复读
			if (repeater[group].times >= setting.repeat.times && !repeater[group].done && Math.random() * 100 <= setting.repeat.probability) {
				repeater[group].done = true;
				return context.message;
			}
		}
	});
}



//好友请求
bot.on('request.friend', (e, context) => {
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
bot.on('request.group.invite', (e, context) => {
	if (setting.autoAddGroup || addGroup[context.group_id]) {
		addGroup[context.group_id] = false;
		bot('set_friend_add_request', {
			flag: context.flag,
			type: invite,
			approve: true
		});
		bot('send_private_msg', {
			user_id: setting.admin,
			message: "已进入群" + context.group_id
		});
	}
});


bot.connect();











//私聊以及群组@的处理
function privateAndAtMsg(e, context) {
	if (hasImage(context.message)) {
		e.cancel();
		searchImg(context);
	} else if (context.message.search("--") === -1) {
		return "必须要发送图片我才能帮你找噢_(:3」」\n支持批量！\n更多功能请发送 --help 查看";
	}
}
//调试模式
function debugRrivateAndAtMsg(e, context) {
	if (context.user_id != setting.admin) {
		e.cancel();
		return "维护升级中，暂时不能使用，抱歉啦~"
	} else {
		privateAndAtMsg(e, context);
	}
}


/**
 * 搜图
 *
 * @param {object} context
 */
function searchImg(context) {
	//提取参数
	function hasCommand(cmd) {
		return context.message.search("--" + cmd) !== -1;
	}

	//得到图片链接并搜图
	var msg = context.message;
	var urls = getImgURLs(msg);
	for (let url of urls) {
		if (hasCommand("get-url")) replyMsg(context, url);
		else {
			saucenao(url, msg).then(ret => {
				replyMsg(context, ret.msg);
				replyMsg(context, ret.warnMsg);
				if (ret.msg.search("anidb.net") !== -1) {
					//搜番
					whatanime(url, hasCommand("debug")).then(ret => {
						replyMsg(context, ret.msg);
					});
				}
			});
		}
	}
}


/**
 * 从消息中提取图片
 *
 * @param {string} msg
 * @returns 图片URL数组
 */
function getImgURLs(msg) {
	var reg = /\[CQ:image[^\]]+url=([^\]]+)\]/g;
	var result = [];
	var search = reg.exec(msg);
	while (search) {
		result.push(search[1]);
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
			user_id: context.group_id,
			message: msg
		});
	} else if (context.discuss_id) {
		bot('send_discuss_msg', {
			user_id: context.discuss_id,
			message: msg
		});
	} else if (context.user_id) {
		bot('send_private_msg', {
			user_id: context.user_id,
			message: msg
		});
	}
}
