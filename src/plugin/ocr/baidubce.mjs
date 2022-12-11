import Path from 'path';
import Axios from 'axios';
import Fs from 'fs-extra';
import _ from 'lodash-es';
import Qs from 'qs';
import { getDirname } from '../../utils/path.mjs';

const __dirname = getDirname(import.meta.url);

const TOKEN_PATH = Path.resolve(__dirname, '../../../data/baidubce.json');

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
const getAccessToken = async () => {
  if (token) {
    if (token.date + 2592000000 - 86400000 > new Date().getTime()) return token.accessToken;
  } else if (Fs.existsSync(TOKEN_PATH)) {
    token = Fs.readJsonSync(TOKEN_PATH);
    return getAccessToken();
  }
  const { apiKey, secretKey } = global.config.bot.ocr.baidubce;
  const accessToken = await Axios.get(
    `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`
  ).then(r => r.data.access_token);
  token = {
    accessToken,
    date: new Date().getTime(),
  };
  Fs.writeJsonSync(TOKEN_PATH, token);
  return accessToken;
};

/**
 * OCR 识别
 *
 * @param {{ url: string }} url 图片地址
 * @param {string} [lang=null] 语言
 * @returns {Promise<string[]>} 识别结果
 */
export default async ({ url }, lang = null) => {
  const addon = {};
  if (lang) {
    if (LANGAlias[lang]) addon.language_type = LANGAlias[lang];
    else addon.language_type = lang.toUpperCase();
  }
  const image = await Axios.get(url, { responseType: 'arraybuffer' }).then(r =>
    Buffer.from(r.data, 'binary').toString('base64')
  );
  const access_token = await getAccessToken();
  const result = await Axios.post(
    `https://aip.baidubce.com/rest/2.0/ocr/v1/${global.config.bot.ocr.baidubce.useApi}`,
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
};
