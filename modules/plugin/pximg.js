import Axios from '../axiosProxy';
import config from '../config';

const setting = config.picfinder.setu;

const app = new (require('koa'))();
const router = require('koa-router')();
const safeKey = Math.random().toString(36).slice(2);
const port = setting.pximgServerPort || 60233;

let usePximgAddr = setting.usePximgAddr.split(':');
if (!usePximgAddr[0]) usePximgAddr[0] = '127.0.0.1';
if (usePximgAddr.length == 1) usePximgAddr.push(port);

function startProxy() {
  router.get('/', ctx => {
    const { url, key } = ctx.request.query;

    if (key != safeKey || !url) {
      ctx.status = 403;
      return;
    }

    return Axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        Referer: 'https://www.pixiv.net',
      },
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
  return `http://${usePximgAddr.join(':')}/?key=${safeKey}&url=${url}`;
}

function toMaster1200(url) {
  return url.replace('img-original', 'img-master').replace(/(.*)\..+$/, '$1_master1200.jpg');
}

export default {
  startProxy,
  getProxyURL,
  toMaster1200,
};
