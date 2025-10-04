import { readdir, rm, stat, writeFile } from 'fs/promises';
import { resolve } from 'path';
import dayjs from 'dayjs';
import Fs from 'fs-extra';
import { getDataPath } from '../../utils/path.mjs';
import { json2csv } from './json2csv.mjs';

const BASE_DIR = getDataPath('groupMemberBackup');

export const ensureDataDir = date => {
  try {
    const dirPath = resolve(BASE_DIR, date);
    Fs.ensureDirSync(dirPath);
  } catch (error) {
    console.error(error);
  }
};

const getWiteData = (data, format) => {
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }

  return json2csv(data);
};

export const writeData = async (date, group, data, format) => {
  try {
    const filePath = resolve(BASE_DIR, date, `${group}.${format}`);
    await writeFile(filePath, getWiteData(data, format));
  } catch (error) {
    console.error(error);
  }
};

export const clearOldData = async () => {
  if (!Fs.existsSync(BASE_DIR)) return;

  const expireMs = dayjs().subtract(30, 'day').valueOf();
  const files = await readdir(BASE_DIR, { withFileTypes: true });

  await Promise.allSettled(
    files
      .filter(f => f.isDirectory() && Number(f.name))
      .map(async ({ name }) => {
        const dirPath = resolve(BASE_DIR, name);
        const dirStat = await stat(dirPath);
        if (dirStat.mtimeMs < expireMs) {
          await rm(dirPath, { recursive: true, force: true });
        }
      }),
  );
};
