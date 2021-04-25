import { EventEmitter } from 'events';

class CqpsEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.inited = false;
    this.once('init', () => (this.inited = true));
  }

  /**
   * 首次初始化
   *
   * @param {Function} cb 回调函数
   */
  onceInit(cb) {
    if (this.inited) cb();
    else this.once('init', cb);
  }
}

export default new CqpsEventEmitter();
