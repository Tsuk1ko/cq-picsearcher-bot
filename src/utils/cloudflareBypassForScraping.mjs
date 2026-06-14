import { isEqual, pick } from 'lodash-es';
import AwaitLock from './awaitLock.mjs';
import Axios from './axiosProxy.mjs';
import emitter from './emitter.mjs';

/**
 * @typedef {Object} CloudflareBypassForScrapingOptions
 * @property {string} url
 * @property {string} proxy
 */

export class CloudflareBypassForScraping {
  /**
   * @param {CloudflareBypassForScrapingOptions} options
   */
  constructor(options) {
    this.options = options;
    this.options.url = this.options.url.replace(/\/+$/, '');
    this.lock = new AwaitLock();
    this.get = this.wrapFunc(this.get);
    this.getJSON = this.wrapFunc(this.getJSON);
    this.getImage = this.wrapFunc(this.getImage);
  }

  /**
   * @param {string} url
   */
  async get(url) {
    const headers = {};

    if (this.options.proxy) {
      headers['x-proxy'] = this.options.proxy;
    }

    const r = await Axios.get(`${this.options.url}/html`, {
      params: { url },
      headers,
      responseType: 'text',
    });

    return {
      request: {
        res: {
          responseUrl: r.headers['x-cf-bypasser-final-url'] || url,
        },
      },
      data: r.data,
    };
  }

  /**
   * @param {string} url
   */
  getJSON(url) {
    return this._get(url, 'json');
  }

  /**
   * @param {string} url
   * @returns {Promise<ArrayBuffer>}
   */
  async getImage(url) {
    const { data } = await this._get(url, 'arraybuffer');
    return data;
  }

  /**
   * @private
   * @param {string} url
   * @param {import('axios').ResponseType} type
   */
  async _get(url, type) {
    const { host, pathname, search } = new URL(url);

    const headers = {
      'x-hostname': host,
    };

    if (this.options.proxy) {
      headers['x-proxy'] = this.options.proxy;
    }

    const r = await Axios.get(`${this.options.url}${pathname}${search}`, {
      headers,
      responseType: type,
    });

    return r;
  }

  /**
   * @param {Function} fn
   */
  wrapFunc(fn) {
    fn = fn.bind(this);
    return async (...args) => {
      await this.lock.acquireAsync();
      try {
        return await fn(...args);
      } finally {
        this.lock.release();
      }
    };
  }
}

const getOptionsFromGlobalConfig = () => pick(global.config.cloudflareBypassForScraping, ['url', 'proxy']);

export let cloudflareBypassForScraping = new CloudflareBypassForScraping(getOptionsFromGlobalConfig());

emitter.onConfigReload(() => {
  const options = getOptionsFromGlobalConfig();
  if (isEqual(options, cloudflareBypassForScraping.options)) return;
  cloudflareBypassForScraping = new CloudflareBypassForScraping(options);
});
