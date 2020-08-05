import Axios from 'axios';
import config from '../../config';
import Path from 'path';
import Fse from 'fs-extra';
import _ from 'lodash';
import Qs from 'qs';

const TOKEN_PATH = Path.resolve(__dirname, '../../../data/baidubce.json');

const { useApi, apiKey, secretKey } = config.picfinder.ocr.baidubce;
const apiURL = `https://aip.baidubce.com/rest/2.0/ocr/v1/${useApi}`;
let token = false;

const LANGAlias = {
  ch: 'CHN_ENG',
  chs: 'CHN_ENG',
  cn: 'CHN_ENG',
  zh: 'CHN_ENG',
  zhs: 'CHN_ENG',
  zht: 'CHN_ENG',
  en: 'ENG',
  jp: 'JAP',
  ko: 'KOR',
  fr: 'FRE',
  ge: 'GER',
  ru: 'RUS',
};

/**
 * 获取 AccessToken
 *
 * @returns AccessToken
 */
async function getAccessToken() {
  if (token) {
    if (token.date + 2592000000 - 86400000 > new Date().getTime()) return token.accessToken;
  } else if (Fse.existsSync(TOKEN_PATH)) {
    token = Fse.readJsonSync(TOKEN_PATH);
    return getAccessToken();
  }
  let accessToken = await Axios.get(
    `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`
  ).then(r => r.data.access_token);
  token = {
    accessToken,
    date: new Date().getTime(),
  };
  Fse.writeJsonSync(TOKEN_PATH, token);
  return accessToken;
}

/**
 * OCR 识别
 *
 * @param {string} url 图片地址
 * @param {string} [lang=null] 语言
 * @returns
 */
async function ocr(url, lang = null) {
  let addon = {};
  if (lang) {
    if (LANGAlias[lang]) addon.language_type = LANGAlias[lang];
    else addon.language_type = lang.toUpperCase();
  }
  let image = await Axios.get(url, { responseType: 'arraybuffer' }).then(r =>
    Buffer.from(r.data, 'binary').toString('base64')
  );
  let access_token = await getAccessToken();
  let result = await Axios.post(
    apiURL,
    Qs.stringify({
      access_token,
      image,
      ...addon,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  ).then(r => r.data.words_result);
  return _.map(result, 'words');
}

export default ocr;
