import _ from 'lodash';
import Path from 'path';
import Fse from 'fs-extra';
import event from '../../event';

const {
  common: { Credential, ClientProfile, HttpProfile },
  ocr: {
    v20181119: { Client, Models },
  },
} = require('tencentcloud-sdk-nodejs');

const LOG_PATH = Path.resolve(__dirname, '../../../data/tencent.ocr.json');

const { SecretId, SecretKey, Region, useApi } = global.config.bot.ocr.tencent;

let log = null;
let client = null;

const init = () => {
  // log
  log = _.transform(useApi, (o, v) => (o[v] = 0), {
    m: new Date().getMonth(),
  });
  if (Fse.existsSync(LOG_PATH)) {
    const old = Fse.readJsonSync(LOG_PATH);
    if (old.m === log.m) Object.assign(log, old);
  }
  // client
  const cred = new Credential(SecretId, SecretKey);
  const httpProfile = new HttpProfile();
  httpProfile.endpoint = 'ocr.tencentcloudapi.com';
  const clientProfile = new ClientProfile();
  clientProfile.httpProfile = httpProfile;
  client = new Client(cred, Region || 'ap-beijing', clientProfile);
};

init();
event.on('reload', init);

/**
 * OCR 识别
 *
 * @param {{ url: string }} url 图片地址
 * @returns {Promise<string[]>} 识别结果
 */
export default ({ url }) => {
  const usage = _.transform(useApi, (o, v) => o.push({ api: v, c: log[v] }), []);
  const min = _.minBy(usage, 'c');

  const req = new Models.GeneralAccurateOCRRequest();
  req.from_json_string(`{"ImageUrl":"${url}"}`);

  return new Promise((resolve, reject) => {
    if (min.c >= 950) {
      reject(new Error('API 免费额度可能即将用完，已自动阻止调用'));
      return;
    }
    client[min.api](req, (errMsg, response) => {
      if (errMsg) {
        reject(errMsg);
        return;
      }

      log[min.api]++;
      Fse.writeJsonSync(LOG_PATH, log);

      resolve(_.map(response.TextDetections, 'DetectedText'));
    });
  });
};
