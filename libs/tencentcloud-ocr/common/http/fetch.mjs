import fetch from 'node-fetch';
import HttpsProxyAgent from 'https-proxy-agent';
export default function (url, options) {
  const instanceOptions = options || {};
  const proxy = options.proxy || process.env.http_proxy;
  if (!options.agent && proxy) {
    instanceOptions.agent = new HttpsProxyAgent(proxy);
  }
  return fetch(url, instanceOptions);
}
