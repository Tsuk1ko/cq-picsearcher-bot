import HttpsProxyAgentOrig from 'https-proxy-agent';

export class HttpsProxyAgent extends HttpsProxyAgentOrig {
  constructor(opts) {
    super(opts);
    this.tlsConnectionOptions = opts.tls;
    const callback = this.callback.bind(this);
    this.callback = (req, opts) => callback(req, Object.assign(opts, this.tlsConnectionOptions));
  }
}
