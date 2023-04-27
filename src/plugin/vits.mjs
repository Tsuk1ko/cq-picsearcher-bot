/* eslint-disable no-irregular-whitespace */
import Axios from 'axios';
import escapeStringRegexp from 'escape-string-regexp';
import { size } from 'lodash-es';
import urlJoin from 'url-join';
import CQ from '../utils/CQcode.mjs';
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
let defaultVoiceId = '';

emitter.onConfigLoad(() => {
  const cmdPart = escapeStringRegexp(global.config.bot.vits.command);
  vitsReg.match = new RegExp(`^${cmdPart}\\s+(?:(\\d+)\\s+)?(?:lang=(\\w+)\\s+)?([\\s\\S]+)$`);
  vitsReg.setDefault = new RegExp(`^${cmdPart}(?:-default|默认)(?:\\s+(\\d+)?)?$`);
  vitsReg.reload = new RegExp(`^${cmdPart}(?:-reload|重载)\\s*$`);
  vitsReg.list = new RegExp(`^${cmdPart}(?:-list|列表)\\s*$`);
  vitsReg.help = new RegExp(`^${cmdPart}(?:-help|帮助)\\s*$`);
});

export default async context => {
  const config = global.config.bot.vits;

  if (!config.command) return false;

  if (handleShowHelp(context)) return true;
  if (await handleShowList(context)) return true;
  if (await handleDefaultVoice(context)) return true;
  if (await handleReload(context)) return true;

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

  const [, id, lang, text] = match;
  const useId = (() => {
    if (id && id in voiceMap) {
      return id;
    }

    const defaultId = defaultVoice[context.user_id];
    if (defaultId && defaultId in voiceMap) {
      return defaultId;
    }

    return defaultVoiceId;
  })();

  global.replyMsg(context, CQ.record(await getVoiceUrl({ id: useId, lang, text: CQ.unescape(text) })));

  return true;
};

const callApi = async (path, params) => {
  const { data } = await Axios.get(urlJoin(global.config.bot.vits.apiUrl, path), { params });
  return data;
};

const updateVoiceMap = async () => {
  try {
    const data = await callApi('/voice/speakers');

    if (!Array.isArray(data.VITS)) {
      console.error('[VITS] updateVoiceMap res unexpected', data);
      return `Error: 非预期的数据\n${JSON.stringify(data)}`;
    }

    if (!data.VITS.length) {
      console.error('[VITS] empty model list', data);
      return `Error: VITS 模型列表为空\n${JSON.stringify(data)}`;
    }

    voiceMap = Object.assign({}, ...data.VITS);
    defaultVoiceId = Object.keys(data.VITS[0])[0] || '';
  } catch (error) {
    console.error('[VITS] updateVoiceMap error');
    logError(error);
    return error;
  }
};

const initVoiceMap = async () => {
  if (!size(voiceMap)) await updateVoiceMap();
};

const handleShowList = async context => {
  if (!vitsReg.list.test(context.message)) return false;

  await initVoiceMap();

  const listText = Object.entries(voiceMap)
    .map(kv => kv.join(' '))
    .join('\n');

  global.replyMsg(context, `id 模型\n${listText || '无'}`);

  return true;
};

const handleDefaultVoice = async context => {
  const match = vitsReg.setDefault.exec(context.message);
  if (!match) return;

  await initVoiceMap();

  const id = match[1];

  if (!id) {
    let curId = defaultVoice[context.user_id];
    if (!(curId in voiceMap)) curId = defaultVoiceId;
    global.replyMsg(context, `当前默认模型为「${voiceMap[curId]}」(id:${curId})`);
    return true;
  }

  if (!(id in voiceMap)) {
    global.replyMsg(context, '设置失败，该 id 不存在', false, true);
    return true;
  }

  defaultVoice[context.user_id] = id;
  global.replyMsg(context, `设置默认模型「${voiceMap[id]}」成功`, false, true);
  return true;
};

const handleReload = async context => {
  if (!vitsReg.reload.test(context.message)) return false;

  if (context.user_id !== global.config.bot.admin) {
    return true;
  }

  const error = await updateVoiceMap();

  if (error) {
    global.replyMsg(context, `模型列表获取失败\n${error}}`, false, true);
  } else {
    global.replyMsg(context, '模型列表获取成功', false, true);
  }

  return true;
};

const handleShowHelp = context => {
  if (!vitsReg.help.test(context.message)) return false;

  const cmd = global.config.bot.vits.command;
  const isEnCmd = /^\w+$/.test(cmd);

  const msg = `VITS 帮助

语音合成 - ${cmd} [id] [lang=<lang>] <text>
例：${cmd} 你好
　　${cmd} 1 好き好き大好き
　　${cmd} lang=mix [ZH]色色[ZH][JA]ダメ[JA]
　　${cmd} 2 lang=mix [ZH]色色[ZH][JA]ダメ[JA]

查看模型列表 - ${cmd}${isEnCmd ? '-list' : '列表'}

设置默认模型 - ${cmd}${isEnCmd ? '-default' : '默认'} [id]
不提供 id 时为查看当前默认模型，设置仅对自己生效

重载模型列表 - ${cmd}${isEnCmd ? '-reload' : '重载'}
仅管理者可用，VITS 模型列表修改后，bot 重启前需要用该命令重新拉取模型列表`;

  global.replyMsg(context, CQ.escape(msg));

  return true;
};

const getVoiceUrl = async ({ id, lang, text }) => {
  const url = new URL(urlJoin(global.config.bot.vits.apiUrl, '/voice'));
  const params = url.searchParams;

  if (id) params.set('id', id);
  if (lang) params.set('lang', lang);
  params.set('text', text);
  params.set('format', 'silk');

  const { data } = await Axios.get(url.href, { responseType: 'arraybuffer' });
  const base64 = Buffer.from(data).toString('base64');

  return `base64://${base64}`;
};
