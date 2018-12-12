/*
 * @Author: Jindai Kirin 
 * @Date: 2018-10-26 14:44:55 
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2018-12-12 21:39:18
 */
import Axios from 'axios';
const app = new(require('koa'))();
const router = require('koa-router')();
const safeKey = Math.random().toString(36).slice(2);

router.get('/', ctx => {
	const {
		url,
		key
	} = ctx.request.query;

	if (key != safeKey) {
		ctx.status = 403;
		return;
	}

	return Axios.get(url, {
		responseType: 'arraybuffer',
		headers: {
			'Referer': 'https://www.pixiv.net'
		}
	}).then(ret => {
		let buffer = Buffer.from(ret.data, 'binary');
		ctx.status = 200;
		ctx.type = ret.headers['content-type'];
		ctx.length = Buffer.byteLength(buffer);
		ctx.body = buffer;
	});
});

app.use(router.routes());
app.listen(60233);


export default {
	getSetu: () => Axios.get('https://api.lolicon.app/setu/zhuzhu.php').then(ret => ret.data),
	pxSafeKey: safeKey
};
