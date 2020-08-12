// 配置检查
try {
  require('./config.json');
} catch ({ code, message }) {
  if (code === 'MODULE_NOT_FOUND') console.log('ERROR: 找不到配置文件 config.json\n');
  else if (message.includes('JSON')) console.error(`ERROR: 配置文件 JSON 格式有误\n${message}\n`);
  else console.error(e);
  process.exit(1);
}

require = require('esm')(module);
module.exports = require('./main');
