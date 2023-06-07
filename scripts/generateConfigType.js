const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const { typeofJsonc } = require('typeof-jsonc');

const ROOT_DIR = resolve(__dirname, '..');

const dts = typeofJsonc(readFileSync(resolve(ROOT_DIR, 'config.default.jsonc')).toString());

writeFileSync(
  resolve(ROOT_DIR, 'src/types/config.d.ts'),
  dts
    .trim()
    .replace('declare interface RootType', 'export declare interface Config')
    .replace(/((?:white|black)Group: )any\[\];/g, '$1Set<number | string>;')
);
