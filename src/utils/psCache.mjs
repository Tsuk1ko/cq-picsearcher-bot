import Path from 'path';
import { encode, decode } from '@msgpack/msgpack';
import Fs from 'fs-extra';
import klaw from 'klaw-sync';
import emitter from './emitter.mjs';
import logError from './logError.mjs';
import { getDirname } from './path.mjs';

const __dirname = getDirname(import.meta.url);

(OLD_DB_PATH => {
  if (Fs.existsSync(OLD_DB_PATH)) Fs.unlinkSync(OLD_DB_PATH);
})(Path.resolve(__dirname, '../../data/db.sqlite'));

/**
 * 搜图缓存
 */
class PSCache {
  constructor() {
    if (this.enable) this.init();
    emitter.onConfigReload(() => {
      if (this.active && !this.enable) this.destroy();
      else if (!this.active && this.enable) this.init();
    });
  }

  init() {
    this.active = true;
    this.clearExpiredCache();
    this.clearExpiredCacheInterval = setInterval(this.clearExpiredCache, 86400000);
  }

  destroy() {
    if (this.clearExpiredCacheInterval) {
      clearInterval(this.clearExpiredCacheInterval);
      this.clearExpiredCacheInterval = null;
    }
    this.active = false;
  }

  /**
   * @private
   */
  get EXPIRE_MS() {
    return Date.now() - (global.config.bot.cache.expire || 172800) * 1000;
  }

  /**
   * @private
   */
  getCachePath(img, db) {
    return Path.resolve(__dirname, '../../data/pscache', `${img.file}.${db}.psc`);
  }

  /**
   * @returns {boolean} 缓存是否启用
   */
  get enable() {
    return global.config.bot.cache.enable;
  }

  /**
   * 设置缓存
   * @param {*} img 图片
   * @param {number} db 搜索库
   * @param {string[]} msgs 消息
   */
  set(img, db, msgs) {
    Fs.outputFileSync(this.getCachePath(img, db), encode(msgs));
  }

  /**
   * 获取缓存
   *
   * @param {*} img 图片
   * @param {number} db 搜索库
   * @returns {string[]}
   */
  get(img, db) {
    const cp = this.getCachePath(img, db);
    if (!Fs.existsSync(cp)) return;
    const { mtimeMs } = Fs.statSync(cp);
    if (this.EXPIRE_MS < mtimeMs) return decode(Fs.readFileSync(cp));
  }

  /**
   * 清除过期缓存
   * @private
   */
  clearExpiredCache() {
    const dir = Path.resolve(__dirname, '../../data/pscache');
    if (!Fs.existsSync(dir)) return;
    try {
      klaw(dir, {
        nodir: true,
        depthLimit: 1,
        filter: ({ stats: { mtimeMs } }) => mtimeMs < this.EXPIRE_MS,
      }).forEach(({ path }) => Fs.removeSync(path));
    } catch (e) {
      console.error('clear expired pscache');
      logError(e);
    }
  }
}

export default new PSCache();
