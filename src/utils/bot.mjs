import { EventEmitter } from 'node:events';
import { WebSocketTransport } from '@aemeath-projects/napcat';
import { camelToSnake } from '@aemeath-projects/napcat/utils';

/**
 * 创建正向 WebSocket 接入，保留现有可调用 bot 入口及 OneBot 响应。
 *
 * @param {import('../types/config').Config['cqws']} config
 */
export default function createBot(config) {
  const { host, port, accessToken, reconnection, reconnectionAttempts, reconnectionDelay } = config;
  const transport = new WebSocketTransport({
    url: `ws://${host}:${port}/`,
    token: accessToken,
    timeout: 120_000,
    ...(reconnection && {
      reconnect: {
        maxRetries: Number.isFinite(reconnectionAttempts) ? reconnectionAttempts : -1,
        initialDelay: reconnectionDelay,
        maxDelay: reconnectionDelay,
        multiplier: 1,
        jitter: 0,
        stableAfterMs: 0,
      },
    }),
  });
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
