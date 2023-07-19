import { map } from 'lodash-es';
import logError from '../../utils/logError.mjs';
import { retryGet } from '../../utils/retry.mjs';
import { USER_AGENT } from './const.mjs';

export class BiliBiliDynamicFeed {
  constructor() {
    this.updateBaseline = '';
    this.isChecking = false;
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
        update_baseline: this.updateBaseline || undefined,
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
      return [];
    }

    const isFirstFetch = !this.updateBaseline;
    this.updateBaseline = data.update_baseline;
    console.log('[BiliBiliDynamicFeed] update baseline', data.update_baseline);

    return isFirstFetch ? [] : data.items.slice(0, data.update_num);
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
      if (await this.checkUpdateNum()) {
        const items = await this.getNewDynamic();
        console.log('[BiliBiliDynamicFeed] new dynamic:', map(items, 'id_str'));
        return items;
      }
    } catch (e) {
      console.error('[BiliBiliDynamicFeed] checkAndGetNewDynamic');
      logError(e);
    } finally {
      this.isChecking = false;
    }
  }
}
