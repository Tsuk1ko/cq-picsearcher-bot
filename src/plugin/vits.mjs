import Axios from 'axios';
import escapeStringRegexp from 'escape-string-regexp';
import { size } from 'lodash-es';
import urlJoin from 'url-join';
import { DailyCount } from '../utils/dailyCount.mjs';
import emitter from '../utils/emitter.mjs';
import logError from '../utils/logError.mjs';
import { useKVStore } from '../utils/store.mjs';

const dailyCount = new DailyCount();
const defaultVoice = useKVStore('vitsDefaultVoice');

/** @type {Record<string, RegExp>} */
const vitsReg = {};

/** @type {Record<string, string>} */
let voiceMap = {};

emitter.onConfigLoad(() => {
  const cmdPart = escapeStringRegexp(global.config.bot.vits.command);
  vitsReg.match = new RegExp(`^${cmdPart}\\s+(?:(\\d+)\\s+)?([\\s\\S]+)`);
  vitsReg.setDefault = new RegExp(`^${cmdPart}(?:-default|默认)\\s+(\\d+)`);
  vitsReg.reload = new RegExp(`^${cmdPart}(?:-reload|重载)`);
  vitsReg.list = new RegExp(`^${cmdPart}(?:-list|列表)`);
});

export default async context => {
  if (await showList(context)) return true;
  if (await setDefaultVoice(context)) return true;
  if (await reload(context)) return true;

  const config = global.config.bot.vits;
  const match = vitsReg.match?.exec(context.message);

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

  return true;
};

const callApi = async path => {
  const { data } = await Axios.get(urlJoin(global.config.bot.vits.apiUrl, path));
  return data;
};

const updateVoiceMap = async () => {
  try {
    const data = await callApi('/voice/speakers');

    if (!Array.isArray(data.VITS)) {
      console.error('[VITS] updateVoiceMap res unexpected', data);
      return;
    }

    voiceMap = Object.assign({}, ...data.VITS);
  } catch (error) {
    console.error('[VITS] updateVoiceMap error');
    logError(error);
    return error;
  }
};

const initVoiceMap = async () => {
  if (!size(voiceMap)) await updateVoiceMap();
};

const showList = async context => {
  if (!vitsReg.list.test(context.message)) return false;

  await initVoiceMap();

  const listText = Object.entries(voiceMap)
    .map(kv => kv.join(' '))
    .join('\n');

  global.replyMsg(context, `id 模型\n${listText || '无'}`);
};

const setDefaultVoice = async context => {
  const id = vitsReg.setDefault.exec(context.message)?.[1];
  if (!id) return false;

  await initVoiceMap();

  if (!(id in voiceMap)) {
    global.replyMsg(context, '设置失败，该 id 不存在', false, true);
    return true;
  }

  defaultVoice[context.user_id] = id;
  global.replyMsg(context, `设置默认模型「${voiceMap[id]}」成功`);
  return true;
};

const reload = async context => {
  if (!vitsReg.reload.test(context.message)) return false;

  if (context.user_id !== global.config.bot.admin) {
    return true;
  }

  const error = await updateVoiceMap();

  if (error) {
    global.replyMsg(context, `模型列表获取失败 ${error}}`, false, true);
  } else {
    global.replyMsg(context, '模型列表获取成功', false, true);
  }

  return true;
};
