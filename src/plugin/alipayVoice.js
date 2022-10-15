import CQ from '../CQcode';

//  符合范围
const isRange = (num) => {
  const n = parseFloat(num);
  const range = [0.01, 99999999.99];
  return n >= range[0] && n <= range[1];
};

const getURL = (num) => {
  // 判断num是否为数字或者小数
  const REG_NUM = /^\d+(\.\d+)?$/;
  if (REG_NUM.test(num) && isRange(num)) {
    return `https://api.uutool.cn/audio/payment/alipay/${num}.mp3`;
    // 备用地址
    // return `https://mm.cqu.cc/share/zhifubaodaozhang/mp3/${num}.mp3`;
  }
  return '';
};

const doReply = (context) => {
  // 获取金额数字
  const num = context.message.replace(/^\/alipay/, '').trim();
  const url = getURL(num);
  if (url) {
    // 回复语音
    return global.replyMsg(context, CQ.record(url));
  }
  return global.replyMsg(context, '请输入正确的金额数字,取值范围0.01~999999999999.99');
};

export default function alipayVoiceHandler(context) {
  if (/^\/alipay/.test(context.message)) {
    doReply(context);
    return true;
  } else return false;
}
