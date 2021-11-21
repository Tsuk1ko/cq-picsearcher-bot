import _ from 'lodash';
import Koa from 'koa';
import Router from '@koa/router';
import { createHttpTerminator } from 'http-terminator';
import emitter from '../emitter';
const Axios = require('../axiosProxy');

const safeKey = Math.random().toString(36).slice(2);
let usePximgAddr = '';
let server = null;
let lastServerConfig = null;

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
  const serverConfig = {
    host: setting.pximgServerHost || '127.0.0.1',
    port: setting.pximgServerPort || 0,
  };
  const hasPximgProxy = !!setting.pximgProxy.trim().length;
  if (server && _.isEqual(serverConfig, lastServerConfig) && !hasPximgProxy) return;
  if (server) {
    await server.terminate();
    server = null;
    lastServerConfig = null;
  }
  if (hasPximgProxy) return;
  try {
    /** @type {import('net').Server} */
    const appServer = await new Promise(resolve => {
      const as = app.listen(serverConfig, () => resolve(as));
    });
    server = createHttpTerminator({
      server: appServer,
      gracefulTerminationTimeout: 0,
    });
    const serverAddr = appServer.address();
    const addr = setting.usePximgAddr.split(':');
    if (!addr[0]) addr[0] = serverAddr.address;
    if (addr.length === 1) addr.push(serverAddr.port);
    usePximgAddr = addr.join(':');
    lastServerConfig = serverConfig;
  } catch (e) {
    console.error(`${global.getTime()} [error] pximg proxy server`);
    console.error(e);
  }
}

startProxy();
emitter.onConfigReload(startProxy);

export function getLocalReverseProxyURL(url) {
  return `http://${usePximgAddr}/?key=${safeKey}&url=${url}`;
}

export function getMaster1200(url) {
  return url.replace('img-original', 'img-master').replace(/(.*)\..+$/, '$1_master1200.jpg');
}
