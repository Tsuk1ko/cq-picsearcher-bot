import Path from 'node:path';
import { minBy } from 'es-toolkit';
import { transform } from 'es-toolkit/compat';
import Fs from 'fs-extra';
import { ocr } from 'tencentcloud-sdk-nodejs-ocr';
import emitter from '../../utils/emitter.mjs';
import { getDirname } from '../../utils/path.mjs';

const __dirname = getDirname(import.meta.url);

const LOG_PATH = Path.resolve(__dirname, '../../../data/tencent.ocr.json');

const { Client } = ocr.v20181119;

let log = null;
/** @type {InstanceType<typeof Client>} */
let client = null;

const init = () => {
  const { SecretId, SecretKey, Region, useApi } = global.config.bot.ocr.tencent;
  // log
  log = transform(useApi, (o, v) => (o[v] = 0), {
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
  const { useApi } = global.config.bot.ocr.tencent;
  const usage = transform(useApi, (o, v) => o.push({ api: v, c: log[v] }), []);
  const min = minBy(usage, item => item.c);

  if (min.c >= 950) {
    throw new Error('API 免费额度可能即将用完，已自动阻止调用');
  }

  return client[min.api]({ ImageUrl: url }).then(res => {
    log[min.api]++;
    Fs.writeJsonSync(LOG_PATH, log);
    return res.TextDetections.map(item => item.DetectedText);
  });
};
