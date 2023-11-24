const { readFileSync, writeFileSync } = require('fs');

const packageJson = JSON.parse(readFileSync('./package.json'));

delete packageJson.dependencies.pm2;

writeFileSync('./package.json', JSON.stringify(packageJson, undefined, 2));
