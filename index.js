const { readJsonSync } = require('fs-extra');
const { resolve } = require('path');

// 配置检查
try {
  readJsonSync(resolve(__dirname, './config.json'));
  readJsonSync(resolve(__dirname, './config.default.json'));
} catch (e) {
  const { code, message } = e;
  const EOL = process.env.npm_execpath ? '\n' : '';
  if (code === 'ENOENT') {
    console.error(`ERROR: 找不到配置文件 config.json${EOL}`);
  } else if (message && message.includes('JSON')) {
    console.error(`ERROR: 配置文件 JSON 格式有误\n${message}${EOL}`);
  } else console.error(e);
  process.exit(1);
}

// eslint-disable-next-line no-global-assign
require = require('esm')(module);
module.exports = require('./main');
