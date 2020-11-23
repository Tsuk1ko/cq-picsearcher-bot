import { globalReg } from './src/utils/global';
import { loadConfig } from './src/config';
import { version } from './package.json';
import { CQWebSocket } from 'cq-websocket';
import saucenao, { snDB } from './src/saucenao';
import whatanime from './src/whatanime';
import ascii2d from './src/ascii2d';
import CQ from './src/CQcode';
import PSCache from './src/cache';
import Logger from './src/Logger';
import RandomSeed from 'random-seed';
import sendSetu from './src/plugin/setu';
import Akhr from './src/plugin/akhr';
import _ from 'lodash';
import minimist from 'minimist';
import { rmdHandler } from './src/plugin/reminder';
import broadcast from './src/broadcast';
import antiBiliMiniApp from './src/plugin/antiBiliMiniApp';
import logError from './src/logError';
import event from './src/event';
import corpus from './src/plugin/corpus';
const ocr = require('./src/plugin/ocr');

const bot = new CQWebSocket(global.config.cqws);
const logger = new Logger();
const rand = RandomSeed.create();

// 全局变量
globalReg({
  bot,
  replyMsg,
  sendMsg2Admin,
});

// 初始化
let psCache = global.config.bot.cache.enable ? new PSCache() : null;
event.on('reload', () => {
  if (global.config.bot.cache.enable && !psCache) psCache = new PSCache();
  setBotEventListener();
});

// 好友请求
bot.on('request.friend', context => {
  let approve = global.config.bot.autoAddFriend;
  const answers = global.config.bot.addFriendAnswers;
  if (approve && answers.length > 0) {
    const comments = context.comment.split('\n');
    try {
      answers.forEach((ans, i) => {
        const a = /(?<=回答:).*/.exec(comments[i * 2 + 1])[0];
        if (ans !== a) approve = false;
      });
    } catch (e) {
      console.error(e);
      approve = false;
    }
  }
  if (approve)
    bot('set_friend_add_request', {
      flag: context.flag,
      sub_type: 'invite',
      approve: true,
    });
});

// 加群请求
const groupAddRequests = {};
bot.on('request.group.invite', context => {
  if (global.config.bot.autoAddGroup)
    bot('set_group_add_request', {
      flag: context.flag,
      approve: true,
    });
  else groupAddRequests[context.group_id] = context.flag;
});

// 设置监听器
function setBotEventListener() {
  ['message.private', 'message.group', 'message.group.@.me'].forEach(name => bot.off(name));
  // 管理员消息
  bot.on('message.private', adminPrivateMsg);
  // 其他的
  if (global.config.bot.debug) {
    if (global.config.bot.enablePM) {
      // 私聊
      bot.on('message.private', debugPrivateAndAtMsg);
    }
    if (global.config.bot.enableGM) {
      // 群组@
      bot.on('message.group.@.me', debugPrivateAndAtMsg);
      // 群组
      bot.on('message.group', debugGroupMsg);
    }
  } else {
    if (global.config.bot.enablePM) {
      // 私聊
      bot.on('message.private', privateAndAtMsg);
    }
    if (global.config.bot.enableGM) {
      // 群组@
      bot.on('message.group.@.me', privateAndAtMsg);
      // 群组
      bot.on('message.group', groupMsg);
    }
  }
}
setBotEventListener();

// 连接相关监听
bot
  .on('socket.connecting', (wsType, attempts) => console.log(`${global.getTime()} 连接中[${wsType}]#${attempts}`))
  .on('socket.failed', (wsType, attempts) => console.log(`${global.getTime()} 连接失败[${wsType}]#${attempts}`))
  .on('socket.error', (wsType, err) => {
    console.error(`${global.getTime()} 连接错误[${wsType}]`);
    console.error(err);
  })
  .on('socket.connect', (wsType, sock, attempts) => {
    console.log(`${global.getTime()} 连接成功[${wsType}]#${attempts}`);
    if (wsType === '/api') {
      setTimeout(() => {
        sendMsg2Admin(`已上线#${attempts}`);
      }, 1000);
    }
  });

// connect
bot.connect();

// 每日任务
setInterval(() => {
  if (bot.isReady() && logger.canDoDailyJob()) {
    setTimeout(() => {
      (global.config.bot.dailyLike || []).forEach(user_id => {
        if (user_id > 0) bot('send_like', { user_id, times: 10 });
      });
    }, 60 * 1000);
  }
}, 60 * 1000);

// 通用处理
function commonHandle(e, context) {
  // 黑名单检测
  if (Logger.checkBan(context.user_id, context.group_id)) return true;

  // 语言库
  if (corpus(context)) return true;

  // 兼容其他机器人
  const startChar = context.message.charAt(0);
  if (startChar === '/' || startChar === '<') return true;

  // 通用指令
  const args = parseArgs(context.message);
  if (args.help) {
    replyMsg(context, 'https://github.com/Tsuk1ko/cq-picsearcher-bot/wiki/%E5%A6%82%E4%BD%95%E9%A3%9F%E7%94%A8');
    return true;
  }
  if (args.version) {
    replyMsg(context, version);
    return true;
  }
  if (args.about) {
    replyMsg(context, 'https://github.com/Tsuk1ko/cq-picsearcher-bot');
    return true;
  }

  // setu
  if (global.config.bot.setu.enable) {
    if (sendSetu(context, replyMsg, logger, bot)) return true;
  }

  // reminder
  if (global.config.bot.reminder.enable) {
    if (rmdHandler(context)) return true;
  }

  //  反哔哩哔哩小程序
  antiBiliMiniApp(context, replyMsg);

  return false;
}

// 管理员私聊消息
function adminPrivateMsg(e, context) {
  if (context.user_id !== global.config.bot.admin) return;

  const args = parseArgs(context.message);

  // 允许加群
  const group = args['add-group'];
  if (group && typeof group === 'number') {
    if (typeof groupAddRequests[context.group_id] === 'undefined') {
      replyMsg(context, `将会同意进入群${group}的群邀请`);
      // 注册一次性监听器
      bot.once('request.group.invite', context2 => {
        if (context2.group_id === group) {
          bot('set_group_add_request', {
            flag: context2.flag,
            type: 'invite',
            approve: true,
          });
          replyMsg(context, `已进入群${context2.group_id}`);
          return true;
        }
        return false;
      });
    } else {
      bot('set_group_add_request', {
        flag: groupAddRequests[context.group_id],
        type: 'invite',
        approve: true,
      });
      replyMsg(context, `已进入群${context.group_id}`);
      delete groupAddRequests[context.group_id];
    }
  }

  if (args.broadcast) {
    broadcast(parseArgs(context.message, false, 'broadcast'));
    return;
  }

  // Ban
  const { 'ban-u': bu, 'ban-g': bg } = args;
  if (bu && typeof bu === 'number') {
    Logger.ban('u', bu);
    replyMsg(context, `已封禁用户${bu}`);
  }
  if (bg && typeof bg === 'number') {
    Logger.ban('g', bg);
    replyMsg(context, `已封禁群组${bg}`);
  }

  // 明日方舟
  if (args['update-akhr'])
    Akhr.updateData()
      .then(() => replyMsg(context, '方舟公招数据已更新'))
      .catch(e => {
        logError(e);
        replyMsg(context, '方舟公招数据更新失败，请查看错误日志');
      });

  // 停止程序（使用 pm2 时相当于重启）
  if (args.shutdown) process.exit();

  // 重载配置
  if (args.reload) {
    loadConfig();
  }
}

// 私聊以及群组@的处理
function privateAndAtMsg(e, context) {
  if (commonHandle(e, context)) {
    e.stopPropagation();
    return;
  }

  if (hasImage(context.message)) {
    // 搜图
    e.stopPropagation();
    searchImg(context);
  } else if (context.message.search('--') !== -1) {
    // 忽略
  } else if (context.message_type === 'private') {
    const dbKey = context.message === 'book' ? 'doujin' : context.message;
    const db = snDB[dbKey];
    if (db) {
      logger.smSwitch(0, context.user_id, true);
      logger.smSetDB(0, context.user_id, db);
      return `已临时切换至[${dbKey}]搜图模式√`;
    } else return global.config.bot.replys.default;
  } else {
    // 其他指令
    return global.config.bot.replys.default;
  }
}

// 调试模式
function debugPrivateAndAtMsg(e, context) {
  if (context.user_id !== global.config.bot.admin) {
    e.stopPropagation();
    return global.config.bot.replys.debug;
  }
  console.log(`${global.getTime()} 收到私聊消息 qq=${context.user_id}`);
  console.log(debugMsgDeleteBase64Content(context.message));
  return privateAndAtMsg(e, context);
}

function debugGroupMsg(e, context) {
  if (context.user_id !== global.config.bot.admin) {
    e.stopPropagation();
    return;
  }
  console.log(`${global.getTime()} 收到群组消息 group=${context.group_id} qq=${context.user_id}`);
  console.log(debugMsgDeleteBase64Content(context.message));
  return groupMsg(e, context);
}

// 群组消息处理
function groupMsg(e, context) {
  if (commonHandle(e, context)) {
    e.stopPropagation();
    return;
  }

  // 进入或退出搜图模式
  const { group_id, user_id } = context;

  if (new RegExp(global.config.bot.regs.searchModeOn).exec(context.message)) {
    // 进入搜图
    e.stopPropagation();
    if (
      logger.smSwitch(group_id, user_id, true, () => {
        replyMsg(context, global.config.bot.replys.searchModeTimeout, true);
      })
    )
      replyMsg(context, global.config.bot.replys.searchModeOn, true);
    else replyMsg(context, global.config.bot.replys.searchModeAlreadyOn, true);
  } else if (new RegExp(global.config.bot.regs.searchModeOff).exec(context.message)) {
    e.stopPropagation();
    // 退出搜图
    if (logger.smSwitch(group_id, user_id, false)) replyMsg(context, global.config.bot.replys.searchModeOff, true);
    else replyMsg(context, global.config.bot.replys.searchModeAlreadyOff, true);
  }

  // 搜图模式检测
  let smStatus = logger.smStatus(group_id, user_id);
  if (smStatus) {
    // 获取搜图模式下的搜图参数
    const getDB = () => {
      const cmd = /^(all|pixiv|danbooru|doujin|book|anime)$/.exec(context.message);
      if (cmd) return snDB[cmd[1]] || -1;
      return -1;
    };

    // 切换搜图模式
    const cmdDB = getDB();
    if (cmdDB !== -1) {
      logger.smSetDB(group_id, user_id, cmdDB);
      smStatus = cmdDB;
      replyMsg(context, `已切换至[${context.message}]搜图模式√`);
    }

    // 有图片则搜图
    if (hasImage(context.message)) {
      // 刷新搜图TimeOut
      logger.smSwitch(group_id, user_id, true, () => {
        replyMsg(context, global.config.bot.replys.searchModeTimeout, true);
      });
      e.stopPropagation();
      searchImg(context, smStatus);
    }
  } else if (global.config.bot.repeat.enable) {
    // 复读（
    // 随机复读，rptLog得到当前复读次数
    if (
      logger.rptLog(group_id, user_id, context.message) >= global.config.bot.repeat.times &&
      getRand() <= global.config.bot.repeat.probability
    ) {
      logger.rptDone(group_id);
      // 延迟2s后复读
      setTimeout(() => {
        replyMsg(context, context.message);
      }, 2000);
    } else if (getRand() <= global.config.bot.repeat.commonProb) {
      // 平时发言下的随机复读
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
  const args = parseArgs(context.message);
  const hasWord = word => context.message.indexOf(word) !== -1;

  // OCR
  if (args.ocr) {
    doOCR(context);
    return;
  }

  // 明日方舟
  if (hasWord('akhr') || hasWord('公招')) {
    doAkhr(context);
    return;
  }

  // 决定搜索库
  let db = snDB[global.config.bot.saucenaoDefaultDB] || snDB.all;
  if (customDB < 0) {
    if (args.pixiv) db = snDB.pixiv;
    else if (args.danbooru) db = snDB.danbooru;
    else if (args.doujin || args.book) db = snDB.doujin;
    else if (args.anime) db = snDB.anime;
    else if (args.a2d) db = -10001;
    else if (context.message_type === 'private') {
      // 私聊搜图模式
      const sdb = logger.smStatus(0, context.user_id);
      if (sdb) {
        db = sdb;
        logger.smSwitch(0, context.user_id, false);
      }
    }
  } else db = customDB;

  // 得到图片链接并搜图
  const msg = context.message;
  const imgs = getImgs(msg);
  for (const img of imgs) {
    if (args['get-url']) replyMsg(context, img.url.replace(/\/([0-9]+)\/\/\1/, '///').replace(/\?.*$/, ''));
    else {
      // 获取缓存
      let hasCache = false;
      if (global.config.bot.cache.enable && !args.purge) {
        const cache = await psCache.getCache(img.file, db);

        // 如果有缓存
        if (cache) {
          hasCache = true;
          for (const cmsg of cache) {
            replySearchMsgs(context, `${CQ.escape('[缓存]')} ${cmsg}`);
          }
        }
      }

      if (!hasCache) {
        // 检查搜图次数
        if (
          context.user_id !== global.config.bot.admin &&
          !logger.canSearch(context.user_id, global.config.bot.searchLimit)
        ) {
          replyMsg(context, global.config.bot.replys.personLimit, false, true);
          return;
        }

        const needCacheMsgs = [];
        let success = true;
        let snLowAcc = false;
        let useAscii2d = args.a2d;
        let useWhatAnime = args.anime;

        // saucenao
        if (!useAscii2d) {
          const snRes = await saucenao(img.url, db, args.debug || global.config.bot.debug);
          if (!snRes.success) success = false;
          if (snRes.lowAcc) snLowAcc = true;
          if (
            (global.config.bot.useAscii2dWhenLowAcc && snRes.lowAcc && (db === snDB.all || db === snDB.pixiv)) ||
            (global.config.bot.useAscii2dWhenQuotaExcess && snRes.excess)
          )
            useAscii2d = true;
          if (!snRes.lowAcc && snRes.msg.indexOf('anidb.net') !== -1) useWhatAnime = true;
          if (snRes.msg.length > 0) needCacheMsgs.push(snRes.msg);
          replySearchMsgs(context, snRes.msg, snRes.warnMsg);
        }

        // ascii2d
        if (useAscii2d) {
          const { color, bovw, asErr } = await ascii2d(img.url, snLowAcc).catch(asErr => ({
            asErr,
          }));
          if (asErr) {
            const errMsg = (asErr.response && asErr.response.data.length < 50 && `\n${asErr.response.data}`) || '';
            replySearchMsgs(context, `ascii2d 搜索失败${errMsg}`);
            console.error(`${global.getTime()} [error] ascii2d`);
            logError(asErr);
          } else {
            replySearchMsgs(context, color, bovw);
            needCacheMsgs.push(color);
            needCacheMsgs.push(bovw);
          }
        }

        // 搜番
        if (useWhatAnime) {
          const waRet = await whatanime(img.url, args.debug || global.config.bot.debug);
          if (!waRet.success) success = false; // 如果搜番有误也视作不成功
          replyMsg(context, waRet.msg, false, true);
          if (waRet.msg.length > 0) needCacheMsgs.push(waRet.msg);
        }

        if (success) logger.doneSearch(context.user_id);

        // 将需要缓存的信息写入数据库
        if (global.config.bot.cache.enable && success) {
          await psCache.addCache(img.file, db, needCacheMsgs);
        }
      }
    }
  }
}

function doOCR(context) {
  const msg = context.message;
  const imgs = getImgs(msg);
  let lang = null;
  const langSearch = /(?<=--lang=)[a-zA-Z]{2,3}/.exec(msg);
  if (langSearch) lang = langSearch[0];

  const handleOcrResult = ret =>
    replyMsg(context, ret.join('\n')).catch(e => {
      replyMsg(context, 'OCR识别发生错误');
      console.error(`${global.getTime()} [error] OCR`);
      console.error(e);
    });

  for (const img of imgs) {
    ocr.default(img, lang).then(handleOcrResult);
  }
}

function doAkhr(context) {
  if (global.config.bot.akhr.enable) {
    if (!Akhr.isDataReady()) {
      replyMsg(context, '数据尚未准备完成，请等待一会，或查看日志以检查数据拉取是否出错');
      return;
    }

    const msg = context.message;
    const imgs = getImgs(msg);

    const handleWords = words => {
      // fix some ...
      if (global.config.bot.akhr.ocr === 'ocr.space') words = _.map(words, w => w.replace(/冫口了/g, '治疗'));
      replyMsg(context, CQ.img64(Akhr.getResultImg(words)));
    };

    const handleError = e => {
      replyMsg(context, '词条识别出现错误：\n' + e);
      console.error(`${global.getTime()} [error] Akhr`);
      console.error(e);
    };

    for (const img of imgs) {
      ocr[global.config.bot.akhr.ocr](img, 'chs').then(handleWords).catch(handleError);
    }
  } else {
    replyMsg(context, '该功能未开启');
  }
}

/**
 * 从消息中提取图片
 *
 * @param {string} msg
 * @returns 图片URL数组
 */
function getImgs(msg) {
  const reg = /\[CQ:image,file=([^,]+),url=([^\]]+)\]/g;
  const result = [];
  let search = reg.exec(msg);
  while (search) {
    result.push({
      file: search[1],
      url: search[2],
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
  return msg.indexOf('[CQ:image') !== -1;
}

/**
 * 发送消息给管理员
 *
 * @param {string} message 消息
 */
function sendMsg2Admin(message) {
  if (bot.isReady() && global.config.bot.admin > 0) {
    bot('send_private_msg', {
      user_id: global.config.bot.admin,
      message,
    });
  }
}

/**
 * 回复消息
 *
 * @param {object} context 消息对象
 * @param {string} message 回复内容
 * @param {boolean} at 是否at发送者
 */
function replyMsg(context, message, at = false, reply = false) {
  if (!bot.isReady() || typeof message !== 'string' || message.length === 0) return;
  if (context.message_type !== 'private') {
    message = `${reply ? CQ.reply(context.message_id) : ''}${at ? CQ.at(context.user_id) : ''}${message}`;
  }
  const logMsg = global.config.bot.debug && debugMsgDeleteBase64Content(message);
  switch (context.message_type) {
    case 'private':
      if (global.config.bot.debug) {
        console.log(`${global.getTime()} 回复私聊消息 qq=${context.user_id}`);
        console.log(logMsg);
      }
      return bot('send_private_msg', {
        user_id: context.user_id,
        message,
      });
    case 'group':
      if (global.config.bot.debug) {
        console.log(`${global.getTime()} 回复群组消息 group=${context.group_id} qq=${context.user_id}`);
        console.log(logMsg);
      }
      return bot('send_group_msg', {
        group_id: context.group_id,
        message,
      });
    case 'discuss':
      if (global.config.bot.debug) {
        console.log(`${global.getTime()} 回复讨论组消息 discuss=${context.discuss_id} qq=${context.user_id}`);
        console.log(logMsg);
      }
      return bot('send_discuss_msg', {
        discuss_id: context.discuss_id,
        message,
      });
  }
}

/**
 * 回复搜图消息
 *
 * @param {object} context 消息对象
 * @param {Array<string>} msgs 回复内容
 */
function replySearchMsgs(context, ...msgs) {
  msgs = msgs.filter(msg => msg && typeof msg === 'string');
  if (msgs.length === 0) return;
  let promises = [];
  //  是否私聊回复
  if (global.config.bot.pmSearchResult) {
    switch (context.message_type) {
      case 'group':
      case 'discuss':
        if (!context.pmTipSended) {
          context.pmTipSended = true;
          replyMsg(context, '搜图结果将私聊发送', false, true);
        }
        break;
    }
    promises = msgs.map(msg =>
      bot('send_private_msg', {
        user_id: context.user_id,
        message: msg,
      })
    );
  } else {
    promises = msgs.map(msg => replyMsg(context, msg, false, true));
  }
  return Promise.all(promises);
}

/**
 * 生成随机浮点数
 *
 * @returns 0到100之间的随机浮点数
 */
function getRand() {
  return rand.floatBetween(0, 100);
}

function parseArgs(str, enableArray = false, _key = null) {
  const m = minimist(
    str
      .replace(/(--\w+)(?:\s*)(\[CQ:)/g, '$1 $2')
      .replace(/(\[CQ:[^\]]+\])(?:\s*)(--\w+)/g, '$1 $2')
      .split(' '),
    {
      boolean: true,
    }
  );
  if (!enableArray) {
    for (const key in m) {
      if (key === '_') continue;
      if (Array.isArray(m[key])) m[key] = m[key][0];
    }
  }
  if (_key && typeof m[_key] === 'string' && m._.length > 0) m[_key] += ' ' + m._.join(' ');
  return m;
}

function debugMsgDeleteBase64Content(msg) {
  return msg.replace(/base64:\/\/[a-z\d+/=]+/gi, '(base64)');
}
