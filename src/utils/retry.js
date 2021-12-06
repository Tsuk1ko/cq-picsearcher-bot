import { get } from 'axios';

/**
 * @param {Function} func
 * @param {number} [times]
 * @param {Function} [onError]
 */
export const retryAync = async (func, times = 1, onError) => {
  while (times--) {
    try {
      return await func();
    } catch (e) {
      if (times === 0) throw e;
      if (onError && onError(e) === false) throw e;
    }
  }
};

/**
 * @param  {Parameters<import('axios').Axios['get']>} args
 */
export const retryGet = (...args) => retryAync(() => get(...args), 3);
