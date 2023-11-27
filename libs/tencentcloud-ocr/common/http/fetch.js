"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const HttpsProxyAgent = require("https-proxy-agent");
function default_1(url, options) {
    const instanceOptions = options || {};
    const proxy = options.proxy || process.env.http_proxy;
    if (!options.agent && proxy) {
        instanceOptions.agent = new HttpsProxyAgent(proxy);
    }
    return node_fetch_1.default(url, instanceOptions);
}
exports.default = default_1;
