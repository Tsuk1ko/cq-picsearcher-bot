import { EventEmitter } from 'node:events';
import { isIP } from 'node:net';
import { ReverseWebSocketTransport, SseTransport, WebSocketTransport } from '@aemeath-projects/napcat';
import { camelToSnake } from '@aemeath-projects/napcat/utils';

/**
 * @param {number} delay
 */
function createReconnectOptions(delay) {
  if (delay <= 0) return undefined;
  return {
    initialDelay: delay,
    maxDelay: delay,
    multiplier: 1,
    jitter: 0,
    maxRetries: -1,
    stableAfterMs: 0,
  };
}

/**
 * @param {string} url
 * @param {string} token
 */
function createReverseWebSocketTransport(url, token) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'ws:') throw new Error('ws-server 的 URL 只支持 ws://');
  if (parsed.username || parsed.password || /[?#]/.test(url)) {
    throw new Error('ws-server 的 URL 不支持用户名、密码、query 或 hash');
  }

  const host = parsed.hostname.replace(/^\[|\]$/g, '');
  const port = Number(parsed.port || 80);
  if (port === 0) throw new Error('ws-server 的端口必须为 1~65535');
  if (!isIP(host)) {
    throw new Error('ws-server 的 host 必须是有效的 IPv4 或 IPv6 地址');
  }

  return new ReverseWebSocketTransport({
    host,
    port,
    path: parsed.pathname,
    token,
  });
}

/**
 * @param {import('../types/config').Config['network']} config
 */
function createTransport({ type, url, token, reconnectionDelay }) {
  switch (type) {
    case 'ws':
      if (!['ws:', 'wss:'].includes(new URL(url).protocol)) {
        throw new Error('ws 的 URL 必须使用 ws:// 或 wss://');
      }
      return new WebSocketTransport({ url, token, reconnect: createReconnectOptions(reconnectionDelay) });
    case 'ws-server':
      return createReverseWebSocketTransport(url, token);
    case 'http-sse':
      if (!['http:', 'https:'].includes(new URL(url).protocol)) {
        throw new Error('http-sse 的 URL 必须使用 http:// 或 https://');
      }
      return new SseTransport({ baseUrl: url, token, reconnect: createReconnectOptions(reconnectionDelay) });
    default:
      throw new Error(`不支持的 network.type: ${type}`);
  }
}

/**
 * 创建网络接入，保留现有可调用 bot 入口及 OneBot 响应。
 *
 * @param {import('../types/config').Config['network']} config
 */
export default function createBot(config) {
  const transport = createTransport(config);
  const events = new EventEmitter({ captureRejections: true });

  transport.on('connect', () => {
    events.emit('connect');
    events.emit('ready');
  });
  ['close', 'error', 'reconnecting', 'giveUp'].forEach(name => {
    transport.on(name, (...args) => events.emit(name, ...args));
  });
  transport.on('event', event => {
    const context = camelToSnake(event);
    const type = context.message_type ?? context.notice_type ?? context.request_type ?? context.meta_event_type;
    if (type) events.emit(`${context.post_type}.${type}`, context);
    events.emit(context.post_type, context);
  });

  /**
   * @param {string} action
   * @param {Record<string, unknown>} [params]
   */
  const call = (action, params = {}) => transport.call(action, params);
  return Object.assign(call, {
    on: events.on.bind(events),
    once: events.once.bind(events),
    off: events.off.bind(events),
    connect: () => transport.connect(),
    isReady: () => transport.state === 'connected',
  });
}
