import _ from 'lodash';
import { Agent } from 'https';
import Axios from 'axios';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { HttpsProxyAgent } from './httpsProxyAgentMod';
import emitter from './emitter';

const CHROME_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36';
const POSTMAN_UA = 'PostmanRuntime/7.29.0';

/**
 * 从代理字符串获取代理
 * @param {string} str
 */
function getAgent(str) {
  if (str.startsWith('http')) return new HttpsProxyAgent(str);
  if (str.startsWith('socks')) return new SocksProxyAgent(str);
}

/**
 * 从代理字符串获取指定 TLS 版本的代理
 * @param {string} str
 * @param {import('tls').SecureVersion} tlsVersion
 */
function getTlsVersionAgent(str, tlsVersion) {
  /** @type {import('tls').SecureContextOptions} */
  const tlsOpts = {
    maxVersion: tlsVersion,
    minVersion: tlsVersion,
  };
  if (typeof str === 'string') {
    const isHttp = str.startsWith('http');
    const isSocks = str.startsWith('socks');
    if (isHttp || isSocks) {
      const opts = { ..._.pick(new URL(str), ['protocol', 'hostname', 'port', 'username', 'password']), tls: tlsOpts };
      if (isHttp) return new HttpsProxyAgent(opts);
      if (isSocks) return new SocksProxyAgent(opts);
    }
  }
  return new Agent(tlsOpts);
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
/** @type {Axios} */
let cfClient = {};

emitter.onConfigLoad(() => {
  const { proxy, cfTLSVersion } = global.config.bot;
  client = createAxios(getAgent(proxy), CHROME_UA);
  cfClient = createAxios(getTlsVersionAgent(proxy, cfTLSVersion), POSTMAN_UA);
});

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
  get cfClient() {
    return cfClient;
  },
  get cfGet() {
    return cfClient.get;
  },
  get cfPost() {
    return cfClient.post;
  },
};
