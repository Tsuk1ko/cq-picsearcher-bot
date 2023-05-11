const { readFileSync } = require('fs');
const { resolve } = require('path');

const rootDir = resolve(__dirname, '..');

const yarnrc = readFileSync(resolve(rootDir, '.yarnrc.yml')).toString();
const yarnPath = /^yarnPath:(.+)/m.exec(yarnrc)?.[1]?.trim();

if (yarnPath) require(resolve(rootDir, yarnPath));
else throw new Error('Yarn path not found.');
