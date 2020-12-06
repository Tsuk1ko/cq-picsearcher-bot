const MAX_TIMEOUT = 2 ** 31 - 1;

class LargeTimeout {
  /**
   * @param {Function} cb
   * @param {Date} next
   * @memberof LargeTimeout
   */
  constructor(cb, next) {
    this.timeout = null;
    const run = () => {
      const ms = next.getTime() - Date.now();
      if (ms > MAX_TIMEOUT) {
        this.timeout = setTimeout(run, MAX_TIMEOUT);
      } else {
        this.timeout = setTimeout(cb, ms);
      }
    };
    run();
  }

  clear() {
    clearTimeout(this.timeout);
  }
}

/**
 * @param {Function} cb
 * @param {Date} next
 * @returns {LargeTimeout}
 */
export const setLargeTimeout = (cb, next) => new LargeTimeout(cb, next);

/**
 * @param {LargeTimeout} lt
 */
export const clearLargeTimeout = lt => lt.clear();
