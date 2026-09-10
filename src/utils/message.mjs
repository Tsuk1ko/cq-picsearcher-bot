import cqws from '@tsuk1ko/cq-websocket';

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
 * @param {{ wordNum?: number; picNum?: number; allowMixed?: boolean }} [options] 复读过滤配置
 * @returns {boolean} 允许复读则返回 true
 */
export const isRepeatableMessage = (msg, { wordNum = 0, picNum = 0, allowMixed = true } = {}) => {
  // 去除 CQ 码后剩余的文本
  const text = msg.replace(/\[CQ:[^\]]+\]/g, '').trim();
  const imgNum = (msg.match(/\[CQ:image/g) || []).length;
  // 图片数量大于等于 picNum 的消息不复读
  if (picNum > 0 && imgNum >= picNum) return false;
  // 字数大于等于 wordNum 的消息不复读
  if (wordNum > 0 && text.length >= wordNum) return false;
  // 不复读图文混排的消息
  if (!allowMixed && imgNum > 0 && text.length > 0) return false;
  return true;
};
