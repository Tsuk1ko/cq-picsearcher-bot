const { readFileSync, writeFileSync } = require('fs');

const packageJson = JSON.parse(readFileSync('./package.json'));

delete packageJson.dependencies.pm2;
delete packageJson.devDependencies;

writeFileSync('./package.json', JSON.stringify(packageJson, undefined, 2));
