const { existsSync } = require('fs');
const { resolve } = require('path');
const { spawn } = require('child_process');

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
  const needUnref = process.env.NEED_UNREF === 'true';
  const p = spawn(command, args, {
    shell: true,
    env: process.env,
    stdio: needUnref ? 'ignore' : 'inherit',
    cwd: resolve(__dirname, '..'),
  });
  if (needUnref) p.unref();
}
