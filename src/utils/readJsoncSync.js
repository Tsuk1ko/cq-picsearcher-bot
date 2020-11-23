const { readFileSync } = require('fs');
const { parse } = require('jsonc-parser');
module.exports = path => parse(readFileSync(path).toString());
