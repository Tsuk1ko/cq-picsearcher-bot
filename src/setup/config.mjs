import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import cjson from 'comment-json';
import deepFreeze from 'deep-freeze';
import { jsonc } from 'jsonc';
import _ from 'lodash-es';
import emitter from '../utils/emitter.mjs';
import { getDirname } from '../utils/path.mjs';

const __dirname = getDirname(import.meta.url);

const CONFIG_PATH = resolve(__dirname, '../../config.jsonc');
const DEFAULT_CONFIG_PATH = resolve(__dirname, '../../config.default.jsonc');

const migration = (obj, oldKey, newKey) => {
  if (!obj) return;
  if (oldKey in obj && !(newKey in obj)) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }
};

const stringToArrayPaths = new Set([
  'saucenaoHost',
  'saucenaoApiKey',
  'whatanimeHost',
  'whatanimeToken',
  'ascii2dHost',
]);
const arrayToSetPaths = new Set([
  'bot.whiteGroup',
  'bot.setu.blackGroup',
  'bot.setu.whiteGroup',
  'bot.bilibili.blackGroup',
  'bot.bilibili.whiteGroup',
  'bot.chatgpt.blackGroup',
  'bot.chatgpt.whiteGroup',
  'bot.vits.blackGroup',
  'bot.vits.whiteGroup',
]);
const noCheckPaths = new Set([
  'bot.bilibili.push',
  'bot.chatgpt.prependMessages',
  'bot.chatgpt.additionParams',
  'bot.chatgpt.overrides',
]);

function recursiveCopy(c, dc, cc, dcc, parentPath = '') {
  for (const key in dc) {
    const path = parentPath ? `${parentPath}.${key}` : key;
    if (dcc && cc && key in cc && noCheckPaths.has(path)) {
      dcc[key] = cc[key];
      continue;
    }
    if (dcc && key in c && !_.isPlainObject(c[key])) {
      dcc[key] = _.clone(c[key]);
    }
    if (stringToArrayPaths.has(path)) {
      const defaultVal = [dc[key]].filter(val => val);
      if (typeof c[key] === 'string') c[key] = c[key] ? [c[key]] : defaultVal;
      else if (Array.isArray(c[key])) {
        c[key] = c[key].filter(val => typeof val === 'string' && val);
        if (!c[key].length) c[key] = defaultVal;
      } else c[key] = defaultVal;
      continue;
    }
    if (_.isPlainObject(c[key]) && _.isPlainObject(dc[key])) {
      recursiveCopy(c[key], dc[key], _.get(cc, key), _.get(dcc, key), path);
    } else if (typeof c[key] === 'undefined' || typeof c[key] !== typeof dc[key]) {
      c[key] = dc[key];
    }
    if (arrayToSetPaths.has(path) && Array.isArray(c[key])) {
      c[key] = new Set(c[key]);
    }
  }
}

function loadJSON(path) {
  try {
    return jsonc.readSync(path);
  } catch (e) {
    const { code, message } = e;
    let msg = '';

    if (code === 'ENOENT') {
      msg = `ERROR: 找不到配置文件 ${e.path}`;
    } else if (message && message.includes('JSON')) {
      msg = `ERROR: 配置文件 JSON 格式有误\n${message}`;
    } else msg = `${e}`;

    throw msg;
  }
}

export function loadConfig(init = false) {
  const conf = loadJSON(CONFIG_PATH);
  const dConf = loadJSON(DEFAULT_CONFIG_PATH);

  if (!(conf && dConf)) return;

  const confCmt = conf.autoUpdateConfig === true && cjson.parse(readFileSync(CONFIG_PATH).toString());
  const dConfCmt = conf.autoUpdateConfig === true && cjson.parse(readFileSync(DEFAULT_CONFIG_PATH).toString());

  // 配置迁移
  if ('picfinder' in conf && !('bot' in conf)) {
    conf.bot = conf.picfinder;
    delete conf.picfinder;
  }
  if ('setu' in conf.bot) {
    if (typeof conf.bot.setu.antiShielding === 'boolean') {
      conf.bot.setu.antiShielding = Number(conf.bot.setu.antiShielding);
    }
  }
  migration(conf.bot, 'saucenaoHideImgWhenLowAcc', 'hideImgWhenLowAcc');
  migration(conf.bot, 'antiBiliMiniApp', 'bilibili');
  migration(conf.bot, 'getDojinDetailFromNhentai', 'getDoujinDetailFromNhentai');
  migration(conf.bot, 'handleBanedHosts', 'handleBannedHosts');
  migration(_.get(conf, 'bot.setu'), 'sendPximgProxys', 'sendPximgProxies');

  recursiveCopy(conf, dConf, confCmt, dConfCmt);
  if (dConfCmt) writeFileSync(CONFIG_PATH, cjson.stringify(dConfCmt, null, 2));

  // 配置迁移
  conf.whatanimeHost.forEach((v, i) => {
    if (v === 'trace.moe') conf.whatanimeHost[i] = 'api.trace.moe';
  });

  deepFreeze(conf);
  global.config = conf;

  if (init) {
    emitter.emit('configReady');
    console.log('配置已加载');
  } else {
    emitter.emit('configReload');
    console.log('配置已重载');
  }
}

try {
  loadConfig(true);
} catch (error) {
  console.error(error);
}
