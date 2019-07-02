/*
 * @Author: Jindai Kirin
 * @Date: 2019-03-26 02:13:45
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2019-07-02 16:59:42
 */

import config from '../config';
import ocr_space from './ocr/ocr.space';
import baidubce from './ocr/baidubce';
import tencent from './ocr/tencent';

const ocrs = {
	'ocr.space': ocr_space,
	baidubce,
	tencent
};

export default {
	default: ocrs[config.picfinder.ocr.use],
	...ocrs
};
