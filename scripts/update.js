const { existsSync } = require('fs');
const { resolve } = require('path');
const { spawnSync } = require('child_process');

try {
  if (existsSync(resolve(__dirname, '../package-lock.json'))) {
    exec('npm', ['run', 'update:npm']);
  } else {
    exec('npm', ['run', 'update:yarn']);
  }
} catch (e) {
  console.error(e);
  exec('npm', ['start']);
}

function exec(command, args) {
  return spawnSync(command, args, {
    shell: true,
    env: process.env,
    stdio: 'inherit',
    cwd: resolve(__dirname, '..'),
  });
}
