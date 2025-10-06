import { load } from 'cheerio';
import { FlareSolverrClient } from 'flaresolverr-client';
import { isEqual, pick } from 'lodash-es';
import { Cookie, CookieJar } from 'tough-cookie';
import AwaitLock from './awaitLock.mjs';
import Axios from './axiosProxy.mjs';
import emitter from './emitter.mjs';
import { retryAsync } from './retry.mjs';

/**
 * @typedef {Object} FlareSolverrOptions
 * @property {string} url
 * @property {string} session
 * @property {any} proxy
 */

class FlareSolverr {
  /**
   * @param {FlareSolverrOptions} options
   */
  constructor(options) {
    this.options = options;
    this.cookieJar = new CookieJar();
    this.client = new FlareSolverrClient(options.url);
    this.ua = '';
    this.lock = new AwaitLock();
    this.get = this.wrapFunc(this.get);
    this.getJSON = this.wrapFunc(this.getJSON);
    this.getImage = this.wrapFunc(this.getImage);
  }

  /**
   * @param {string} url
   */
  async get(url) {
    const r = await this.client.requestGet({
      url,
      session: this.options.session || undefined,
      proxy: this.options.proxy || undefined,
      maxTimeout: 90000,
    });

    this.ua = r.solution.userAgent || this.ua;
    r.solution.cookies.forEach(c => {
      this.cookieJar.setCookie(
        new Cookie({
          domain: c.domain,
          expires: new Date(c.expiry * 1000),
          httpOnly: c.httpOnly,
          key: c.name,
          path: c.path,
          sameSite: c.sameSite,
          secure: c.secure,
          value: c.value,
        }),
        r.solution.url,
      );
    });

    return {
      request: {
        res: {
          responseUrl: r.solution.url,
        },
      },
      data: r.solution.response,
    };
  }

  /**
   * @param {string} url
   * @returns {Promise<Awaited<ReturnType<FlareSolverr['get']>> & { data: any }>}
   */
  async getJSON(url) {
    const r = await this.get(url);
    const $ = load(r.data);

    r.data = JSON.parse($('body > pre').text());

    return r;
  }

  /**
   * @param {string} url
   * @returns {Promise<ArrayBuffer>}
   */
  async getImage(url) {
    const headers = {};

    if (this.ua) {
      headers['User-Agent'] = this.ua;
    }

    const cookie = this.cookieJar.getCookieStringSync(url);

    if (cookie) {
      headers.Cookie = cookie;
    }

    const arrayBuffer = await retryAsync(
      () =>
        Axios.get(url, {
          responseType: 'arraybuffer',
          headers,
        }).then(r => r.data),
      3,
      e => e.code === 'ECONNRESET',
    );

    return arrayBuffer;
  }

  waitReady() {
    if (this.preparePromise) return this.preparePromise;
    this.preparePromise = this.prepare();
    return this.preparePromise;
  }

  async prepare() {
    if (!this.options.session) return;

    if (global.config.flaresolverr.autoDestroySession) {
      const { sessions } = await this.client.listSessions();

      // 已存在的情况下需要重新创建会话，以防代理配置变更
      if (sessions.includes(this.options.session)) {
        await this.client.destroySession({
          session: this.options.session,
        });
      }
    }

    await this.client.createSession(
      {
        session: this.options.session,
        proxy: this.options.proxy || undefined,
      },
      false,
    );
  }

  /**
   * @param {Function} fn
   */
  wrapFunc(fn) {
    fn = fn.bind(this);
    return async (...args) => {
      await this.waitReady();
      await this.lock.acquireAsync();
      try {
        return await fn(...args);
      } finally {
        this.lock.release();
      }
    };
  }
}

const getOptionsFromGlobalConfig = () => pick(global.config.flaresolverr, ['url', 'session', 'proxy']);

export let flareSolverr = new FlareSolverr(getOptionsFromGlobalConfig());

emitter.onConfigReload(() => {
  const options = getOptionsFromGlobalConfig();
  if (isEqual(options, flareSolverr.options)) return;
  flareSolverr = new FlareSolverr(options);
});
