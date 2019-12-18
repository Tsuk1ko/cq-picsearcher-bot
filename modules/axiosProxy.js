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

const options = {};
const agent = getAgent(PROXY);
if (agent) options.httpsAgent = agent;

const client = Axios.create({
    ...options,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.79 Safari/537.36',
    },
});

const get = client.get;

export default client;
export { get };
