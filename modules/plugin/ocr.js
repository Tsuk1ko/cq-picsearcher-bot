/*
 * @Author: Jindai Kirin 
 * @Date: 2019-03-26 02:13:45 
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2019-04-26 15:45:18
 */

import {
	get
} from 'axios';
import config from '../config';

const {
	defaultLANG,
	apikey
} = config.picfinder.ocr;

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
	ru: 'rus'
};

/**
 * OCR 识别
 *
 * @param {string} url 图片地址
 * @param {string} [lang=defaultLANG] 语言
 * @returns
 */
function ocr(url, lang = defaultLANG) {
	return get(`https://api.ocr.space/parse/imageurl?apikey=${apikey||'helloworld'}&url=${encodeURIComponent(url)}&language=${LANGAlias[lang]||lang||'eng'}`).then(ret => ({
		text: ret.data.ParsedResults[0].ParsedText.replace(/( *)\r\n$/, ''),
		json: ret.data
	}));
}

export default ocr;
