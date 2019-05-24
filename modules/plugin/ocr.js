/*
 * @Author: Jindai Kirin
 * @Date: 2019-03-26 02:13:45
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2019-05-25 03:19:27
 */

import config from '../config';
import ocr_space from './ocr/ocr.space';
import baidubce from './ocr/baidubce';

const ocrs = {
	'ocr.space': ocr_space,
	baidubce
};

export default {
	default: ocrs[config.picfinder.ocr.use],
	...ocrs
};
