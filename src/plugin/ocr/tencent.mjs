import Path from 'path';
import _ from 'lodash-es';
import Fs from 'fs-extra';
import { ocr } from 'tencentcloud-sdk-nodejs';
import emitter from '../../utils/emitter.mjs';
import { getDirname } from '../../utils/path.mjs';
const { Client } = ocr.v20181119;

const __dirname = getDirname(import.meta.url);

const LOG_PATH = Path.resolve(__dirname, '../../../data/tencent.ocr.json');

const { SecretId, SecretKey, Region, useApi } = global.config.bot.ocr.tencent;

let log = null;
/** @type {Client} */
let client = null;

const init = () => {
  // log
  log = _.transform(useApi, (o, v) => (o[v] = 0), {
    m: new Date().getMonth(),
  });
  if (Fs.existsSync(LOG_PATH)) {
    const old = Fs.readJsonSync(LOG_PATH);
    if (old.m === log.m) Object.assign(log, old);
  }
  // client
  client = new Client({
    credential: {
      secretId: SecretId,
      secretKey: SecretKey,
    },
    region: Region || 'ap-beijing',
    profile: {
      httpProfile: {
        endpoint: 'ocr.tencentcloudapi.com',
      },
    },
  });
};

init();
emitter.onConfigReload(init);

/**
 * OCR 识别
 *
 * @param {{ url: string }} url 图片地址
 * @returns {Promise<string[]>} 识别结果
 */
export default ({ url }) => {
  const usage = _.transform(useApi, (o, v) => o.push({ api: v, c: log[v] }), []);
  const min = _.minBy(usage, 'c');

  if (min.c >= 950) {
    throw new Error('API 免费额度可能即将用完，已自动阻止调用');
  }

  return client[min.api]({ ImageUrl: url }).then(res => {
    log[min.api]++;
    Fs.writeJsonSync(LOG_PATH, log);
    return _.map(res.TextDetections, 'DetectedText');
  });
};
