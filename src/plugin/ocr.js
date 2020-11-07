import ocr_space from './ocr/ocr.space';
import baidubce from './ocr/baidubce';
import tencent from './ocr/tencent';
import qq from './ocr/qq';

const ocrs = {
  'ocr.space': ocr_space,
  baidubce,
  tencent,
  qq,
};

module.exports = {
  get default() {
    return ocrs[global.config.bot.ocr.use];
  },
  ...ocrs,
};
