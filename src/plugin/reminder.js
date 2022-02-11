import Path from 'path';
import Fse from 'fs-extra';
import Parser from 'cron-parser';
import minimist from 'minimist';
import _ from 'lodash';
import { setLargeTimeout, clearLargeTimeout } from '../utils/largeTimeout';
import logError from '../logError';
import emitter from '../emitter';
import CQ from '../CQcode';
import sendSetu from './setu';

const rmdFile = Path.resolve(__dirname, '../../data/rmd.json');
let rmd = null;
const timeout = new Map();

emitter.onConfigLoad(rmdInit);

function rmdInit() {
  stopAll();
  if (global.config.bot.reminder.enable) {
    restoreRmd();
  }
}

function saveRmd() {
  Fse.writeJsonSync(rmdFile, rmd);
}

function restoreRmd() {
  if (Fse.existsSync(rmdFile)) {
    rmd = Fse.readJsonSync(rmdFile);
    _.forEach(_.omit(rmd, 'next'), list => {
      _.forEach(list, rlist => {
        _.forEach(rlist, (item, tid) => {
          const interval = Parser.parseExpression(item.time);
          start(tid, interval, item);
        });
      });
    });
  } else {
    rmd = { g: {}, d: {}, u: {}, next: 0 };
  }
}

function parseArgs(str, enableArray = false) {
  const m = minimist(str.split(' '), {
    string: ['rmd', 'time'],
    boolean: true,
  });
  if (!enableArray) {
    for (const key in m) {
      if (key === '_') continue;
      if (Array.isArray(m[key])) m[key] = m[key][0];
    }
  }
  return m;
}

function ctxAvailable(ctx) {
  const setting = global.config.bot.reminder;
  //  限制场景
  if (ctx.user_id !== global.config.bot.admin) {
    if (setting.onlyAdmin) {
      return false;
    } else if (setting.onlyPM) {
      if (ctx.group_id || ctx.discuss_id) return false;
    }
  }
  return true;
}

function start(tid, interval, item) {
  const { ctx, msg } = item;
  const setting = global.config.bot.reminder;
  const now = _.now();
  let next = interval.next();
  while (next.getTime() < now) next = interval.next();

  timeout.set(
    tid,
    setLargeTimeout(() => {
      if (setting.enable && ctxAvailable(ctx)) {
        if (msg.startsWith('<精华消息>') && ctx.message_type === 'group') {
          if (item.essence) {
            global.bot('delete_essence_msg', { message_id: item.essence }).catch(e => {
              logError(`${global.getTime()} [error] reminder remove essence`);
              logError(e);
            });
            item.essence = null;
            saveRmd();
          }
          global.replyMsg(ctx, msg.replace(/^<精华消息>/, '')).then(r => {
            const message_id = _.get(r, 'data.message_id');
            if (message_id) {
              global
                .bot('set_essence_msg', { message_id })
                .then(() => {
                  item.essence = message_id;
                  saveRmd();
                })
                .catch(e => {
                  logError(`${global.getTime()} [error] reminder set essence`);
                  logError(e);
                });
            }
          });
        } else if (
          msg.startsWith('<setu>') &&
          ctx.message_type === 'group' &&
          ctx.user_id === global.config.bot.admin
        ) {
          if (!global.config.bot.setu.enable) return;
          sendSetu(
            {
              ...ctx,
              message: msg.replace(/^<setu>/, ''),
            },
            false
          );
        } else global.replyMsg(ctx, msg);
      }
      start(tid, interval, item);
    }, next)
  );
}

function stop(tid) {
  if (timeout.has(tid)) {
    clearLargeTimeout(timeout.get(tid));
    timeout.delete(tid);
    return true;
  } else return false;
}

function stopAll() {
  timeout.forEach(lto => clearLargeTimeout(lto));
  timeout.clear();
}

function addRmd(type, rid, tid, uid, msg, time, ctx) {
  const t = rmd[type];
  if (!t[rid]) t[rid] = {};
  t[rid][tid] = { uid, msg, time, ctx };
  saveRmd();
  return t[rid][tid];
}

function parseCtx(ctx) {
  switch (ctx.message_type) {
    case 'private':
      return { type: 'u', rid: ctx.user_id };
    case 'group':
      return { type: 'g', rid: ctx.group_id };
    case 'discuss':
      return { type: 'd', rid: ctx.discuss_id };
    case 'guild':
      return { type: 'd', rid: `${ctx.guild_id}_${ctx.channel_id}` };
  }
  return { type: '', rid: 0 };
}

function rmdHandler(ctx) {
  const args = parseArgs(ctx.message);
  if (args.rmd && args.rmd.length > 0) {
    if (!ctxAvailable(ctx)) return false;
    add(ctx, args);
    return true;
  } else if (typeof args['rmd-del'] === 'number') {
    del(ctx, args['rmd-del']);
    return true;
  } else if (args['rmd-list']) {
    list(ctx);
    return true;
  }
  return false;
}

function add(ctx, args) {
  const { type, rid } = parseCtx(ctx);

  if (_.size(rmd[type][rid]) >= 20) {
    global.replyMsg(ctx, '提醒太多啦，不能再加啦！', true);
    return;
  }

  if (!args.time) {
    global.replyMsg(ctx, '时间呢？', true);
    return;
  }

  if (args._.length > 0) args.rmd += ' ' + args._.join(' ');

  const rctx = _.pick(ctx, ['message_type', 'user_id', 'group_id', 'discuss_id', 'guild_id', 'channel_id']);
  const cron = args.time.replace(/;/g, ' ');

  const cronParts = cron.split(' ');
  if (cronParts.length < 5) {
    global.replyMsg(ctx, 'time 格式有误，请使用 crontab 时间格式，并将空格替换成英文分号(;)', true);
    return;
  }
  if (cronParts.length > 5) {
    global.replyMsg(ctx, '禁止使用秒级 cron 指令', true);
    return;
  }
  const min = cronParts[0].split('/');
  if (min[0] === '*' && (!min[1] || parseInt(min[1]) < 5)) {
    global.replyMsg(ctx, '提醒间隔需大于 5 分钟', true);
    return;
  }
  if (min[0].split(',').length > 5) {
    global.replyMsg(ctx, '一个提醒应该用不到这么多分钟级别的逗号吧（', true);
    return;
  }

  try {
    const interval = Parser.parseExpression(cron);
    const tid = rmd.next++;
    const item = addRmd(type, rid, tid, ctx.user_id, args.origin ? CQ.unescape(args.rmd) : args.rmd, cron, rctx);
    start(tid, interval, item);
    global.replyMsg(ctx, `添加成功(ID=${tid})`, true);
  } catch (e) {
    global.replyMsg(ctx, 'time 格式有误，请使用 crontab 时间格式，并将空格替换成英文分号(;)', true);
  }
}

function list(ctx) {
  const { type, rid } = parseCtx(ctx);
  const list = rmd[type][rid];
  const replys = _.transform(
    list,
    (arr, { uid, msg, time }, tid) => {
      let short = msg
        .replace(/\[CQ:image,[^\]]+\]/g, '[图片]')
        .replace(/\[CQ:at,[^\]]+\]/g, '[@]')
        .replace(/\n/g, ' ');
      if (short.length > 10) short = short.substr(0, 10) + '...';
      arr.push([tid, uid, time, short].join(' | '));
    },
    [['ID', '创建者', 'crontab', '内容'].join(' | ')]
  );
  global.replyMsg(ctx, replys.join('\n'));
}

function del(ctx, tid) {
  const { type, rid } = parseCtx(ctx);
  try {
    const tlist = rmd[type][rid];
    const item = tlist[tid];
    if (!item) throw new Error();
    if (item.essence) {
      global.bot('delete_essence_msg', { message_id: item.essence }).catch(e => {
        logError(`${global.getTime()} [error] reminder remove essence`);
        logError(e);
      });
    }
    delete tlist[tid];
    if (!_.size(tlist)) delete rmd[type][rid];
    saveRmd();
    stop(tid);
    global.replyMsg(ctx, `删除提醒(ID=${tid})成功`);
  } catch (error) {
    global.replyMsg(ctx, '删除失败，ID不存在或该提醒不属于这里');
  }
}

export { rmdHandler };
