import { EventEmitter } from 'events';

const event = new EventEmitter();

event.inited = false;
event.once('init', () => (event.inited = true));

/**
 * 首次初始化
 *
 * @param {Function} cb 回调函数
 */
event.onceInit = cb => {
  if (event.inited) cb();
  else event.once('init', cb);
};

export default event;
