import { writeJsonSync } from 'fs-extra';
import { resolve } from 'path';
import conf from '../config.json';
import dConf from '../config.default.json';

function isObject(obj) {
  return typeof obj == 'object' && !Array.isArray(obj);
}

function recursiveCopy(c, dc) {
  for (let key in dc) {
    if (key == 'saucenaoHost' || key == 'whatanimeHost') {
      if (typeof c[key] == 'string') c[key] = [c[key]];
    }
    if (isObject(c[key]) && isObject(dc[key])) recursiveCopy(c[key], dc[key]);
    else if (typeof c[key] == 'undefined' || typeof c[key] != typeof dc[key]) c[key] = dc[key];
  }
}

// 配置迁移
let needSave = false;
if (!conf.$schema) {
  conf.$schema = dConf.$schema;
  needSave = true;
}
if ('picfinder' in conf && !('bot' in conf)) {
  conf.bot = conf.picfinder;
  delete conf.picfinder;
  needSave = true;
}
if ('saucenaoHideImgWhenLowAcc' in conf.bot && !('hideImgWhenLowAcc' in conf.bot)) {
  conf.bot.hideImgWhenLowAcc = conf.bot.saucenaoHideImgWhenLowAcc;
  delete conf.bot.saucenaoHideImgWhenLowAcc;
  needSave = true;
}
if (needSave) writeJsonSync(resolve(__dirname, '../config.json'), conf, { spaces: 2 });

recursiveCopy(conf, dConf);

export default conf;
