import { EventEmitter } from 'events';

class CqpsEventEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(0);
    this.configReady = false;
    this.once('configReady', () => (this.configReady = true));
  }

  /**
   * 配置就绪
   * @param {Function} cb 回调函数
   */
  onConfigReady(cb) {
    if (this.configReady) setTimeout(cb);
    else this.once('configReady', cb);
  }

  /**
   * 配置重载
   * @param {Function} cb 回调函数
   */
  onConfigReload(cb) {
    this.on('configReload', cb);
  }

  /**
   * 配置载入
   * @param {Function} cb 回调函数
   */
  onConfigLoad(cb) {
    this.onConfigReady(cb);
    this.onConfigReload(cb);
  }

  /**
   * Bot 实例已创建
   * @param {Function} cb 回调函数
   */
  onBotCreated(cb) {
    this.once('botCreated', cb);
  }
}

export default new CqpsEventEmitter();
