/* eslint-disable vars-on-top */
import type * as main from '../index.mjs';
import type createBot from '../utils/bot.mjs';

declare global {
  var bot: ReturnType<typeof createBot>;
  var config: import('../types/config').Config;
  var replyMsg: (typeof main)['replyMsg'];
  var sendMsg2Admin: (typeof main)['sendMsg2Admin'];
  var parseArgs: (typeof main)['parseArgs'];
  var replySearchMsgs: (typeof main)['replySearchMsgs'];
  var replyGroupForwardMsgs: (typeof main)['replyGroupForwardMsgs'];
  var replyPrivateForwardMsgs: (typeof main)['replyPrivateForwardMsgs'];
  var sendGroupMsg: (typeof main)['sendGroupMsg'];
  function getTime(): string;
}

export const globalReg: (value: any) => void;
