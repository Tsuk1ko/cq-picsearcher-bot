import CQ from '../CQcode';

const ENUM_SCENCE = {
  a: ['private', 'group'],
  g: ['group'],
  p: ['private'],
};
const isCtxMatchScence = ({ message_type }, scence) => {
  if (!(scence in ENUM_SCENCE)) return false;
  return ENUM_SCENCE[scence].includes(message_type);
};

export default ctx => {
  const rules = global.config.bot.corpus;
  let stop = false;

  for (let { regexp, reply, scene } of rules) {
    if ([regexp, reply, scene].some(v => !(typeof v === 'string' && v.length))) continue;
    if (!isCtxMatchScence(ctx, scene)) continue;

    const reg = new RegExp(regexp);
    const exec = reg.exec(ctx.message);
    if (!exec) continue;

    stop = true;
    reply = reply.replace(/\[CQ:at\]/g, ctx.message_type === 'private' ? '' : CQ.at(ctx.user_id));

    if (reply.includes('[CQ:delete]')) {
      reply = reply.replace(/\[CQ:delete\]/g, '');
      if (ctx.message_type === 'group') global.bot('delete_msg', { message_id: ctx.message_id });
    }

    const replyMsg = exec[0].replace(reg, reply);
    if (replyMsg.length) global.replyMsg(ctx, replyMsg);
    break;
  }

  return stop;
};
