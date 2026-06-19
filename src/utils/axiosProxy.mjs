import Axios from 'axios';
import { SocksProxyAgent } from 'socks-proxy-agent';
import emitter from './emitter.mjs';
import { HttpsProxyAgent } from './httpsProxyAgentMod.mjs';

export const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36';

/**
 * 从代理字符串获取代理
 * @param {string} str
 */
function getAgent(str) {
  if (str.startsWith('http')) return new HttpsProxyAgent(str);
  if (str.startsWith('socks')) return new SocksProxyAgent(str);
}

function createAxios(httpsAgent, ua) {
  return Axios.create({
    ...(httpsAgent ? { httpsAgent } : {}),
    headers: {
      'User-Agent': ua,
    },
  });
}

/** @type {Axios} */
let client = {};

emitter.onConfigLoad(() => {
  const { proxy } = global.config.bot;
  client = createAxios(getAgent(proxy), USER_AGENT);
});

export default {
  get client() {
    return client;
  },
  get userAgent() {
    return USER_AGENT;
  },
  get get() {
    return client.get;
  },
  get post() {
    return client.post;
  },
  getBase64(url, config = {}) {
    return client
      .get(url, { ...config, responseType: 'arraybuffer' })
      .then(({ data }) => Buffer.from(data).toString('base64'));
  },
};
