import { resolve } from 'path';
import { ensureDirSync, existsSync, removeSync, writeFileSync } from 'fs-extra';
import klaw from 'klaw-sync';
import md5 from 'md5';

const DAY_MS = 24 * 3600 * 1000;
const CACHE_DIR = resolve(__dirname, '../../data/cache');

export const createCache = data => {
  const buffer = Buffer.from(data);
  const filename = md5(buffer);
  const filepath = resolve(CACHE_DIR, filename);
  ensureDirSync(CACHE_DIR);
  writeFileSync(filepath, buffer);
  return filepath;
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
