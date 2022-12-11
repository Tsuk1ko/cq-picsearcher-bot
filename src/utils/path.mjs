import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

export const getDirname = importMetaUrl => dirname(fileURLToPath(importMetaUrl));

export const resolveByDirname = (importMetaUrl, path) => resolve(getDirname(importMetaUrl), path);
