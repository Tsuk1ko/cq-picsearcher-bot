import config from '../config';
import ocr_space from './ocr/ocr.space';
import baidubce from './ocr/baidubce';
import tencent from './ocr/tencent';

const ocrs = {
  'ocr.space': ocr_space,
  baidubce,
  tencent,
};

export default {
  default: ocrs[config.bot.ocr.use],
  ...ocrs,
};
