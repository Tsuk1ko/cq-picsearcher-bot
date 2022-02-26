import tls from 'tls';
import HttpsProxyAgent from 'https-proxy-agent';

export default class HttpsProxyAgentMod extends HttpsProxyAgent {
  constructor(opts: string | (HttpsProxyAgent.HttpsProxyAgentOptions & { tls: tls.ConnectionOptions }));
}
