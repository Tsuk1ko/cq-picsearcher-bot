import config from './config';
import Axios from 'axios';
import SocksProxyAgent from 'socks-proxy-agent';
import HttpsProxyAgent from 'https-proxy-agent';

const PROXY = config.picfinder.proxy;

/**
 * 从代理字符串获取代理
 *
 * @param {string} str
 */
function getAgent(str) {
    if (str.startsWith('http://') || str.startsWith('https://')) return new HttpsProxyAgent(str);
    if (str.startsWith('socks://')) return new SocksProxyAgent(str, true);
}

let client = Axios;
const agent = getAgent(PROXY);

if (agent) {
    client = Axios.create({
        httpsAgent: agent,
    });
}

const get = client.get;

export default client;
export { get };
