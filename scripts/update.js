const { spawn } = require('child_process');
const { join, resolve } = require('path');
const { ensureDirSync, openSync, existsSync } = require('fs-extra');

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
  const runByCqps = process.env.RUN_BY_CQPS === 'true';
  const p = spawn(command, args, {
    shell: true,
    env: process.env,
    stdio: runByCqps ? getLogStdio() : 'inherit',
    cwd: resolve(__dirname, '..'),
  });
  if (runByCqps && process.platform !== 'win32') p.unref();
}

function getLogStdio() {
  const logsDir = resolve(__dirname, '../logs');
  ensureDirSync(logsDir);
  const logFile = join(logsDir, 'update.log');
  const out = openSync(logFile, 'a');
  const err = openSync(logFile, 'a');
  return ['ignore', out, err];
}
