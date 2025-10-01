import { load } from 'cheerio';
import { FlareSolverrClient } from 'flaresolverr-client';
import { isEqual, pick } from 'lodash-es';
import { Cookie, CookieJar } from 'tough-cookie';
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
    this.get = this.get.bind(this);
    this.getImage = this.getImage.bind(this);
  }

  /**
   * @param {string} url
   */
  async get(url) {
    await this.waitReady();

    const r = await this.client.requestGet({
      url,
      session: this.options.session || undefined,
      proxy: this.options.proxy || undefined,
      maxTimeout: 120000,
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
    await this.waitReady();

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
    await this.waitReady();

    const headers = {};

    if (this.ua) {
      headers['User-Agent'] = this.ua;
    }

    const cookie = this.cookieJar.getCookieStringSync(url);
    console.log('cookie:', cookie);

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
}

const getOptionsFromGlobalConfig = () => pick(global.config.flaresolverr, ['url', 'session', 'proxy']);

export let flareSolverr = new FlareSolverr(getOptionsFromGlobalConfig());

emitter.onConfigReload(() => {
  const options = getOptionsFromGlobalConfig();
  if (isEqual(options, flareSolverr.options)) return;
  flareSolverr = new FlareSolverr(options);
});
