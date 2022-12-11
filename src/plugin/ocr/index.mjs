import ocrspace from './ocr.space.mjs';
import baidubce from './baidubce.mjs';
import tencent from './tencent.mjs';
import qq from './qq.mjs';

const ocrs = {
  'ocr.space': ocrspace,
  baidubce,
  tencent,
  qq,
};

export default {
  get default() {
    return ocrs[global.config.bot.ocr.use];
  },
  get akhr() {
    return ocrs[global.config.bot.akhr.ocr];
  },
  ...ocrs,
};
