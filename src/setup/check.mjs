import { resolve } from 'path';
import Fs from 'fs-extra';
import { jsonc } from 'jsonc';
import { getDirname } from '../utils/path.mjs';

const __dirname = getDirname(import.meta.url);

try {
  const CONFIG_PATH = resolve(__dirname, '../../config.jsonc');
  const OLD_CONFIG_PATH = resolve(__dirname, '../../config.json');
  const DEFAULT_CONFIG_PATH = resolve(__dirname, '../../config.default.jsonc');
  // 配置迁移
  if (Fs.existsSync(OLD_CONFIG_PATH) && !Fs.existsSync(CONFIG_PATH)) {
    Fs.renameSync(OLD_CONFIG_PATH, CONFIG_PATH);
  }
  // 配置检查
  jsonc.readSync(CONFIG_PATH);
  jsonc.readSync(DEFAULT_CONFIG_PATH);
} catch (e) {
  const { code, message } = e;
  const EOL = process.env.npm_execpath ? '\n' : '';
  if (code === 'ENOENT') {
    console.error(`ERROR: 找不到配置文件 ${e.path}${EOL}`);
  } else if (message && message.includes('JSON')) {
    console.error(`ERROR: 配置文件 JSON 格式有误\n${message}${EOL}`);
  } else console.error(e);
  process.exit(1);
}
