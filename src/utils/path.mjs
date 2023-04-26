import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export const getDirname = importMetaUrl => dirname(fileURLToPath(importMetaUrl));

export const resolveByDirname = (importMetaUrl, ...paths) => resolve(getDirname(importMetaUrl), ...paths);

export const getDataPath = file => resolveByDirname(import.meta.url, '../../data', file);
