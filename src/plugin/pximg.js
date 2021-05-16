import Koa from 'koa';
import Router from 'koa-router';
import { createHttpTerminator } from 'http-terminator';
import event from '../event';
const Axios = require('../axiosProxy');

const safeKey = Math.random().toString(36).slice(2);
let usePximgAddr = '';
let server = null;
let serverPort = null;

const app = new Koa();
const router = new Router();
router.get('/', ctx => {
  const { url, key } = ctx.request.query;
  if (key !== safeKey || !url) {
    ctx.status = 403;
    return;
  }
  return Axios.get(url, {
    responseType: 'arraybuffer',
    headers: {
      Referer: 'https://www.pixiv.net',
    },
    validateStatus: null,
  }).then(ret => {
    const buffer = Buffer.from(ret.data, 'binary');
    ctx.status = ret.status;
    ctx.type = ret.headers['content-type'];
    ctx.length = Buffer.byteLength(buffer);
    ctx.body = buffer;
  });
});
app.use(router.routes()).use(router.allowedMethods());

async function startProxy() {
  const setting = global.config.bot.setu;
  const port = setting.pximgServerPort || 0;
  if (server && serverPort === port) return;
  if (server) {
    await server.terminate();
    server = null;
    serverPort = null;
  }
  if (setting.pximgProxy.trim().length) return;
  try {
    const appServer = app.listen(port);
    server = createHttpTerminator({
      server: appServer,
      gracefulTerminationTimeout: 0,
    });
    serverPort = port;
    const addr = setting.usePximgAddr.split(':');
    if (!addr[0]) addr[0] = '127.0.0.1';
    if (addr.length === 1) addr.push(appServer.address().port);
    usePximgAddr = addr.join(':');
  } catch (e) {
    console.error(`${global.getTime()} [error] pximg proxy server`);
    console.error(e);
  }
}

startProxy();
event.on('reload', startProxy);

export function getProxyURL(url) {
  return `http://${usePximgAddr}/?key=${safeKey}&url=${url}`;
}

export function getMaster1200(url) {
  return url.replace('img-original', 'img-master').replace(/(.*)\..+$/, '$1_master1200.jpg');
}
