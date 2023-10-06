import { map } from 'lodash-es';
import NodeCache from 'node-cache';
import logError from '../../utils/logError.mjs';
import { retryGet } from '../../utils/retry.mjs';
import { USER_AGENT } from './const.mjs';

const FULL_CHECK_INTERVAL = 60 * 1000;

export class BiliBiliDynamicFeed {
  constructor() {
    this.updateBaseline = '';
    this.lastFullCheckTime = 0;
    this.isChecking = false;
    this.isAvailable = true;
    this.checkedDynamicIdCache = new NodeCache({
      useClones: false,
      stdTTL: 86400, // 1d
    });
  }

  static get enable() {
    const { useFeed, cookie } = global.config.bot.bilibili;
    return !!(useFeed && cookie);
  }

  /**
   * @returns {any[]}
   */
  async getNewDynamic() {
    const {
      data: { data, code, message },
    } = await retryGet('https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all', {
      timeout: 10000,
      params: {
        timezone_offset: new Date().getTimezoneOffset(),
        type: 'all',
        // update_baseline: this.updateBaseline || undefined,
        page: 1,
        features: 'itemOpusStyle',
      },
      headers: {
        Cookie: global.config.bot.bilibili.cookie,
        'User-Agent': USER_AGENT,
        Origin: 'https://t.bilibili.com',
        Referer: 'https://t.bilibili.com/',
      },
    });

    if (code !== 0) {
      console.error(`[BiliBiliDynamicFeed] getNewDynamic error: (${code})${message}`);
      this.handleError(code);
      return [];
    }

    this.lastFullCheckTime = Date.now();

    const lastBaseLine = this.updateBaseline;
    if (this.updateBaseline !== data.update_baseline) {
      this.updateBaseline = data.update_baseline;
      if (global.config.bot.debug) console.log('[BiliBiliDynamicFeed] update baseline', data.update_baseline);
    }
    if (!lastBaseLine) {
      this.markItemsChecked(data.items);
      return [];
    }

    const lastIndex = data.items.findIndex(({ id_str }) => this.checkedDynamicIdCache.has(id_str));
    const newItems = lastIndex >= 0 ? data.items.slice(0, lastIndex) : data.items;
    const items = newItems.filter(({ id_str }) => !this.checkedDynamicIdCache.has(id_str));
    this.markItemsChecked(data.items);

    return items;
  }

  markItemsChecked(items) {
    this.checkedDynamicIdCache.mset(items.map(({ id_str }) => ({ key: id_str, val: true })));
  }

  /**
   * @returns {number}
   */
  async checkUpdateNum() {
    if (!this.updateBaseline) {
      await this.getNewDynamic();
      return 0;
    }

    const {
      data: { data, code, message },
    } = await retryGet('https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all/update', {
      timeout: 10000,
      params: {
        type: 'all',
        update_baseline: this.updateBaseline,
      },
      headers: {
        Cookie: global.config.bot.bilibili.cookie,
        'User-Agent': USER_AGENT,
        Origin: 'https://t.bilibili.com',
        Referer: 'https://t.bilibili.com/',
      },
    });

    if (code !== 0) {
      console.error(`[BiliBiliDynamicFeed] checkUpdateNum error: (${code})${message}`);
      this.handleError(code);
      return 0;
    }

    return data.update_num;
  }

  /**
   * @returns {any[]}
   */
  async checkAndGetNewDynamic() {
    if (this.isChecking) return [];
    this.isChecking = true;

    try {
      if (Date.now() - this.lastFullCheckTime > FULL_CHECK_INTERVAL || (await this.checkUpdateNum())) {
        const items = await this.getNewDynamic();
        if (items.length) {
          if (global.config.bot.debug) console.log('[BiliBiliDynamicFeed] new dynamic:', map(items, 'id_str'));
        }
        return items;
      }
    } catch (e) {
      console.error('[BiliBiliDynamicFeed] checkAndGetNewDynamic');
      logError(e);
    } finally {
      this.isChecking = false;
    }

    return [];
  }

  handleError(code) {
    if (code === -101) this.isAvailable = false;
  }
}
