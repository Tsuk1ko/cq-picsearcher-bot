import { resolve } from 'path';
import Fs from 'fs-extra';
import klaw from 'klaw-sync';
import md5 from 'md5';
import logError from './logError.mjs';
import { getDirname } from './path.mjs';

const __dirname = getDirname(import.meta.url);

const DAY_MS = 24 * 3600 * 1000;
const CACHE_DIR = resolve(__dirname, '../../data/cache');

export const createCache = (key, data) => {
  const filename = md5(key);
  const filepath = resolve(CACHE_DIR, filename);
  Fs.ensureDirSync(CACHE_DIR);
  Fs.writeFileSync(filepath, data instanceof Buffer ? data : Buffer.from(data));
  return filepath;
};

export const getCache = key => {
  const filename = md5(key);
  const filepath = resolve(CACHE_DIR, filename);
  return Fs.existsSync(filepath) ? filepath : null;
};

const releaseExpiredCache = () => {
  if (!Fs.existsSync(CACHE_DIR)) return;
  const expireMs = Date.now() - 7 * DAY_MS; // 7 天过期
  try {
    klaw(CACHE_DIR, {
      nodir: true,
      depthLimit: 1,
      filter: ({ stats: { mtimeMs } }) => mtimeMs < expireMs,
    }).forEach(({ path }) => Fs.removeSync(path));
  } catch (e) {
    console.error('clear expired cache');
    logError(e);
  }
};

releaseExpiredCache();
setInterval(releaseExpiredCache, DAY_MS);
