import { get } from '../../axiosProxy';
import config from '../../config';

const { defaultLANG, apikey } = config.picfinder.ocr['ocr.space'];

const LANGAlias = {
  ch: 'chs',
  cn: 'chs',
  zh: 'chs',
  zhs: 'chs',
  zht: 'cht',
  en: 'eng',
  jp: 'jpn',
  ko: 'kor',
  fr: 'fre',
  ge: 'ger',
  ru: 'rus',
};

/**
 * OCR 识别
 *
 * @param {string} url 图片地址
 * @param {string} [lang=defaultLANG] 语言
 * @returns
 */
function ocr(url, lang = defaultLANG) {
  return get(
    `https://api.ocr.space/parse/imageurl?apikey=${apikey || 'helloworld'}&url=${encodeURIComponent(url)}&language=${
      LANGAlias[lang] || lang || 'eng'
    }`
  ).then(ret => ret.data.ParsedResults[0].ParsedText.replace(/( *)\r\n$/, '').split('\r\n'));
}

export default ocr;
