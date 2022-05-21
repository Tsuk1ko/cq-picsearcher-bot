import tls from 'tls';
import HttpsProxyAgentOrig from 'https-proxy-agent';

export class HttpsProxyAgent extends HttpsProxyAgentOrig {
  constructor(opts: string | (HttpsProxyAgentOrig.HttpsProxyAgentOptions & { tls: tls.ConnectionOptions }));
}
