const Axios = require('../../axiosProxy');

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
 * @param {{ url: string }} url 图片地址
 * @param {string} [lang] 语言
 * @returns {Promise<string[]>} 识别结果
 */
export default ({ url }, lang) => {
  const { defaultLANG, apikey } = global.config.bot.ocr['ocr.space'];
  lang = lang || defaultLANG;
  return Axios.get(
    `https://api.ocr.space/parse/imageurl?apikey=${apikey || 'helloworld'}&url=${encodeURIComponent(url)}&language=${
      LANGAlias[lang] || lang || 'eng'
    }`
  ).then(ret => ret.data.ParsedResults[0].ParsedText.replace(/( *)\r\n$/, '').split('\r\n'));
};
