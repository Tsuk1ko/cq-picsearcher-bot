import { jsonc } from 'jsonc';
import { resolve } from 'path';
import deepFreeze from 'deep-freeze';
import event from './event';

import Akhr from './plugin/akhr';
import { rmdInit } from './plugin/reminder';

const CONFIG_PATH = resolve(__dirname, '../config.jsonc');
const DEFAULT_CONFIG_PATH = resolve(__dirname, '../config.default.jsonc');

function isObject(obj) {
  return typeof obj === 'object' && !Array.isArray(obj);
}

function recursiveCopy(c, dc) {
  for (const key in dc) {
    if (key === 'saucenaoHost' || key === 'whatanimeHost') {
      if (typeof c[key] === 'string') c[key] = [c[key]];
    }
    if (isObject(c[key]) && isObject(dc[key])) recursiveCopy(c[key], dc[key]);
    else if (typeof c[key] === 'undefined' || typeof c[key] !== typeof dc[key]) c[key] = dc[key];
  }
}

function loadJSON(path) {
  try {
    return jsonc.readSync(path);
  } catch (e) {
    const { code, message } = e;
    let msg = '';

    if (code === 'ENOENT') {
      msg = `ERROR: 找不到配置文件 ${path}`;
    } else if (message && message.includes('JSON')) {
      msg = `ERROR: 配置文件 JSON 格式有误\n${message}`;
    } else msg = `${e}`;

    console.error(global.getTime(), msg);

    global.sendMsg2Admin(msg);
  }
  return null;
}

export function loadConfig(init = false) {
  const conf = loadJSON(CONFIG_PATH);
  const dConf = loadJSON(DEFAULT_CONFIG_PATH);

  if (!(conf && dConf)) return;

  // 配置迁移
  if ('picfinder' in conf && !('bot' in conf)) {
    conf.bot = conf.picfinder;
    delete conf.picfinder;
  }
  if ('saucenaoHideImgWhenLowAcc' in conf.bot && !('hideImgWhenLowAcc' in conf.bot)) {
    conf.bot.hideImgWhenLowAcc = conf.bot.saucenaoHideImgWhenLowAcc;
    delete conf.bot.saucenaoHideImgWhenLowAcc;
  }
  if ('setu' in conf.bot) {
    if (typeof conf.bot.setu.antiShielding === 'boolean') {
      conf.bot.setu.antiShielding = Number(conf.bot.setu.antiShielding);
    }
  }

  recursiveCopy(conf, dConf);
  deepFreeze(conf);
  global.config = conf;

  if (conf.bot.reminder.enable) rmdInit();
  if (conf.bot.akhr.enable) Akhr.init().catch(console.error);

  if (init) {
    event.emit('init');
    console.log(global.getTime(), '配置已加载');
  } else {
    event.emit('reload');
    console.log(global.getTime(), '配置已重载');
    global.sendMsg2Admin('配置已重载');
  }
}

loadConfig(true);
