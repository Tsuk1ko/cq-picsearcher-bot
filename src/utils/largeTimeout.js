const MAX_TIMEOUT = 2 ** 31 - 1;

class LargeTimeout {
  constructor(cb, ms) {
    this.timeout = null;
    const run = () => {
      if (ms > MAX_TIMEOUT) {
        ms -= MAX_TIMEOUT;
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

export const setLargeTimeout = (cb, ms) => new LargeTimeout(cb, ms);
export const clearLargeTimeout = lt => lt.clear();
