import cqws from '@tsuk1ko/cq-websocket';
import { getRegWithCache } from './regCache.mjs';

export const getRawMessage = data =>
  typeof data.raw_message === 'string'
    ? data.raw_message
    : Array.isArray(data.message)
      ? cqws.convertArrayMsgToStringMsg(data.message)
      : data.message;

/**
 * 判断消息是否允许复读
 *
 * @param {string} msg 消息
 * @returns {boolean} 允许复读则返回 true
 */
export const isRepeatableMessage = msg => {
  const { maxWordNum, maxPicNum, allowMixed, allowLink, disallowReg } = global.config.bot.repeat;
  // 去除 CQ 码后剩余的文本
  const text = msg.replace(/\[CQ:[^\]]+\]/g, '').trim();
  const imgNum = (msg.match(/\[CQ:image/g) || []).length;
  // 图片数量大于等于 maxPicNum 的消息不复读
  if (maxPicNum > 0 && imgNum >= maxPicNum) return false;
  // 字数大于等于 maxWordNum 的消息不复读
  if (maxWordNum > 0 && text.length >= maxWordNum) return false;
  // 不复读图文混排的消息
  if (!allowMixed && imgNum > 0 && text.length > 0) return false;
  // 不复读含链接的消息
  if (!allowLink && /https?:\/\/\w/.test(msg)) return false;
  // 不复读符合 disallowReg 的消息
  if (disallowReg && getRegWithCache(global.config.bot.repeat, 'disallowReg').test(msg)) return false;
  return true;
};
