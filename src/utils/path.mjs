import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const getDirname = importMetaUrl => dirname(fileURLToPath(importMetaUrl));

export const resolveByDirname = (importMetaUrl, ...paths) => resolve(getDirname(importMetaUrl), ...paths);

export const getDataPath = file => resolveByDirname(import.meta.url, '../../data', file);
