import { resolve } from 'path';
import { ensureDirSync, existsSync, removeSync, writeFileSync } from 'fs-extra';
import klaw from 'klaw-sync';
import md5 from 'md5';

const DAY_MS = 24 * 3600 * 1000;
const CACHE_DIR = resolve(__dirname, '../../data/cache');

export const createCache = (key, data) => {
  const filename = md5(key);
  const filepath = resolve(CACHE_DIR, filename);
  ensureDirSync(CACHE_DIR);
  writeFileSync(filepath, Buffer.from(data));
  return filepath;
};

export const getCache = key => {
  const filename = md5(key);
  const filepath = resolve(CACHE_DIR, filename);
  return existsSync(filepath) ? filepath : null;
};

const releaseExpiredCache = () => {
  if (!existsSync(CACHE_DIR)) return;
  const expireMs = Date.now() - 7 * DAY_MS; // 7 天过期
  try {
    klaw(CACHE_DIR, {
      nodir: true,
      depthLimit: 1,
      filter: ({ stats: { mtimeMs } }) => mtimeMs < expireMs,
    }).forEach(({ path }) => removeSync(path));
  } catch (e) {
    console.error(`${global.getTime()} clear expired cache`);
    console.error(e);
  }
};

releaseExpiredCache();
setInterval(releaseExpiredCache, DAY_MS);
