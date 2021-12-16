import Axios from 'axios';
import SocksProxyAgent from 'socks-proxy-agent';
import HttpsProxyAgent from 'https-proxy-agent';
import emitter from './emitter';

/**
 * 从代理字符串获取代理
 *
 * @param {string} str
 */
function getAgent(str) {
  if (str.startsWith('http://') || str.startsWith('https://')) return new HttpsProxyAgent(str);
  if (str.startsWith('socks://')) return new SocksProxyAgent(str, true);
}

function createAxios() {
  const httpsAgent = getAgent(global.config.bot.proxy);
  return Axios.create({
    ...(httpsAgent ? { httpsAgent } : {}),
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36',
    },
  });
}

/** @type {Axios} */
let client = {};

emitter.onConfigLoad(() => (client = createAxios()));

module.exports = {
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
      .then(r => Buffer.from(r.data, 'binary').toString('base64'));
  },
};
