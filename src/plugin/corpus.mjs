import { map } from 'lodash-es';
import CQ from '../utils/CQcode.mjs';
import { randomWithWeight } from '../utils/math.mjs';

const ENUM_SCENE = {
  a: ['private', 'group'],
  g: ['group'],
  p: ['private'],
  all: ['private', 'group'],
  group: ['group'],
  private: ['private'],
};
const isCtxMatchRule = ({ message_type, user_id, group_id }, { regexp, scene, users, groups }) => {
  if ([regexp, scene].some(v => !(typeof v === 'string' && v.length))) return false;
  if (!(scene in ENUM_SCENE)) return false;
  if (!ENUM_SCENE[scene].includes(message_type)) return false;
  if (Array.isArray(users) && users.length && !users.includes(user_id)) return false;
  if (Array.isArray(groups) && groups.length && group_id && !groups.includes(group_id)) return false;
  return true;
};

export default ctx => {
  const rules = global.config.bot.corpus;
  let stop = false;

  for (const rule of rules) {
    let { reply } = rule;

    if (!isCtxMatchRule(ctx, rule)) continue;
    if (!(typeof reply === 'string' && reply.length) && !Array.isArray(reply)) continue;

    const reg = new RegExp(rule.regexp);
    const exec = reg.exec(ctx.message);
    if (!exec) continue;

    if (Array.isArray(reply)) {
      reply = reply.filter(
        obj =>
          typeof obj === 'string' ||
          (typeof obj?.text === 'string' &&
            (obj.weight === undefined || (typeof obj.weight === 'number' && obj.weight > 0)))
      );
      if (!reply.length) continue;
      reply = reply.map(obj => {
        if (typeof obj === 'string') return { text: obj, weight: 1 };
        if (obj.weight === undefined) return { text: obj.text, weight: 1 };
        return obj;
      });
      reply = reply[randomWithWeight(map(reply, 'weight'))].text;
    }

    stop = true;
    reply = reply.replace(/\[CQ:at\]/g, ctx.message_type === 'private' ? '' : CQ.at(ctx.user_id));

    if (reply.includes('[CQ:delete]')) {
      reply = reply.replace(/\[CQ:delete\]/g, '');
      if (ctx.message_type === 'group') global.bot('delete_msg', { message_id: ctx.message_id });
    }

    if (reply.startsWith('<replace>')) {
      reply = reply.replace(/^<replace>/, '');
      ctx.message = exec[0].replace(reg, reply);
      stop = false;
      if (global.config.bot.debug) console.log(`[corpus] 消息替换为\n${ctx.message}`);
      break;
    }

    const replyMsg = exec[0].replace(reg, reply);
    if (replyMsg.length) global.replyMsg(ctx, replyMsg);
    break;
  }

  return stop;
};
