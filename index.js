require('dotenv').config();
const { existsSync, renameSync } = require('fs-extra');
const { resolve } = require('path');
const {
  jsonc: { readSync: readJsoncSync },
} = require('jsonc');

try {
  const CONFIG_PATH = resolve(__dirname, './config.jsonc');
  const OLD_CONFIG_PATH = resolve(__dirname, './config.json');
  const DEFAULT_CONFIG_PATH = resolve(__dirname, './config.default.jsonc');
  // 配置迁移
  if (existsSync(OLD_CONFIG_PATH) && !existsSync(CONFIG_PATH)) {
    renameSync(OLD_CONFIG_PATH, CONFIG_PATH);
  }
  // 配置检查
  readJsoncSync(CONFIG_PATH);
  readJsoncSync(DEFAULT_CONFIG_PATH);
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

process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

// eslint-disable-next-line no-global-assign
require = require('esm')(module);
module.exports = require('./main');
