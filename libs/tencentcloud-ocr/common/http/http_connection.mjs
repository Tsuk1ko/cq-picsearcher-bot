import QueryString from 'querystring';
import { URL } from 'url';
import isStream from 'is-stream';
import getStream from 'get-stream';
import FormData from 'form-data';
import Sign from '../sign.mjs';
import fetch from './fetch.mjs';
import JSONBigInt from 'json-bigint';

const JSONbigNative = JSONBigInt({ useNativeBigInt: true });
/**
 * @inner
 */
export class HttpConnection {
  static async doRequest({ method, url, data, timeout, headers = {}, agent, proxy, signal }) {
    const config = {
      method: method,
      headers: Object.assign({}, headers),
      timeout,
      agent,
      proxy,
      signal,
    };
    if (method === 'GET') {
      url += '?' + QueryString.stringify(data);
    } else {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      config.body = QueryString.stringify(data);
    }
    return await fetch(url, config);
  }
  static async doRequestWithSign3({
    method,
    url,
    data,
    service,
    action,
    region,
    version,
    secretId,
    secretKey,
    multipart = false,
    timeout = 60000,
    token,
    requestClient,
    language,
    headers = {},
    agent,
    proxy,
    signal,
  }) {
    // data 中可能带有 readStream，由于需要计算整个 body 的 hash，
    // 所以这里把 readStream 转为 Buffer
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    await convertReadStreamToBuffer(data);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    data = deepRemoveNull(data);
    const timestamp = parseInt(String(new Date().getTime() / 1000));
    method = method.toUpperCase();
    let payload = '';
    if (method === 'GET') {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      data = mergeData(data);
      url += '?' + QueryString.stringify(data);
    }
    if (method === 'POST') {
      payload = data;
    }
    const config = {
      method,
      timeout,
      headers: Object.assign({}, headers, {
        Host: new URL(url).host,
        'X-TC-Action': action,
        'X-TC-Region': region,
        'X-TC-Timestamp': timestamp,
        'X-TC-Version': version,
        'X-TC-Token': token,
        'X-TC-RequestClient': requestClient,
      }),
      agent,
      proxy,
      signal,
    };
    if (token === null || token === undefined) {
      delete config.headers['X-TC-Token'];
    }
    if (region === null || region === undefined) {
      delete config.headers['X-TC-Region'];
    }
    if (language) {
      config.headers['X-TC-Language'] = language;
    }
    let form;
    if (method === 'GET') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    if (method === 'POST' && !multipart) {
      config.body = JSONbigNative.stringify(data);
      config.headers['Content-Type'] = 'application/json';
    }
    if (method === 'POST' && multipart) {
      form = new FormData();
      for (const key in data) {
        form.append(key, data[key]);
      }
      config.body = form;
      config.headers = Object.assign({}, config.headers, form.getHeaders());
    }
    const signature = Sign.sign3({
      method,
      url,
      payload,
      timestamp,
      service,
      secretId,
      secretKey,
      multipart,
      boundary: form ? form.getBoundary() : undefined,
    });
    config.headers['Authorization'] = signature;
    return await fetch(url, config);
  }
}
async function convertReadStreamToBuffer(data) {
  for (const key in data) {
    if (isStream(data[key])) {
      data[key] = await getStream.buffer(data[key]);
    }
  }
}
function mergeData(data, prefix = '') {
  const ret = {};
  for (const k in data) {
    if (data[k] === null) {
      continue;
    }
    if (data[k] instanceof Array || data[k] instanceof Object) {
      Object.assign(ret, mergeData(data[k], prefix + k + '.'));
    } else {
      ret[prefix + k] = data[k];
    }
  }
  return ret;
}
function deepRemoveNull(obj) {
  if (isArray(obj)) {
    return obj.map(deepRemoveNull);
  } else if (isObject(obj)) {
    const result = {};
    for (const key in obj) {
      const value = obj[key];
      if (!isNull(value)) {
        result[key] = deepRemoveNull(value);
      }
    }
    return result;
  } else {
    return obj;
  }
}
function isBuffer(x) {
  return Buffer.isBuffer(x);
}
function isArray(x) {
  return Array.isArray(x);
}
function isObject(x) {
  return typeof x === 'object' && !isArray(x) && !isStream(x) && !isBuffer(x) && x !== null;
}
function isNull(x) {
  return x === null;
}
