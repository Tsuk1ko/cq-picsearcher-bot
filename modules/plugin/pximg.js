/*
 * @Author: Jindai Kirin 
 * @Date: 2019-01-04 22:40:04 
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2019-05-25 03:52:07
 */

import Axios from 'axios';
const app = new(require('koa'))();
const router = require('koa-router')();
const safeKey = Math.random().toString(36).slice(2);
const port = 60233;

function startProxy() {
	router.get('/', ctx => {
		const {
			url,
			key
		} = ctx.request.query;

		if (key != safeKey || !url) {
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

	try {
		app.listen(port);
	} catch (error) {
		console.error(`端口${port}已被占用，本地pximg反代启动失败`);
	}
}

function getProxyURL(url) {
	return `http://127.0.0.1:${port}/?key=${safeKey}&url=${url}`;
}


export default {
	startProxy,
	getProxyURL
};
