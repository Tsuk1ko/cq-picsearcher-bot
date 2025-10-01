import Axios from 'axios';
import { SocksProxyAgent } from 'socks-proxy-agent';
import emitter from './emitter.mjs';
import { HttpsProxyAgent } from './httpsProxyAgentMod.mjs';

const CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36';

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
  client = createAxios(getAgent(proxy), CHROME_UA);
});

export default {
  get client() {
    return client;
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
