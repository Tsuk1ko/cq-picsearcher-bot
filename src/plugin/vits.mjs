import escapeStringRegexp from 'escape-string-regexp';
import { DailyCount } from '../utils/dailyCount.mjs';
import emitter from '../utils/emitter.mjs';

const dailyCount = new DailyCount();

/** @type {RegExp} */
let cmdReg;

emitter.onConfigLoad(() => {
  const cmdPart = escapeStringRegexp(global.config.bot.vits.command);
  cmdReg = new RegExp(`^${cmdPart}\\s+(?:(\\d+)\\s+)?([\\s\\S]+)`);
});

export default async context => {
  const config = global.config.bot.vits;

  const match = cmdReg?.exec(context.message);

  if (!match) return false;

  if (context.group_id) {
    const { blackGroup, whiteGroup } = config;
    if (blackGroup.has(context.group_id)) return true;
    if (whiteGroup.size && !whiteGroup.has(context.group_id)) return true;
  }

  if (config.userDailyLimit) {
    if (dailyCount.get(context.user_id) >= config.userDailyLimit) {
      global.replyMsg(context, '今天玩的够多啦，明天再来吧！', false, true);
      return true;
    } else dailyCount.add(context.user_id);
  }

  console.log(match);
};
