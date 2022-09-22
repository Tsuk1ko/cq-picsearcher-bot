import { get, post } from 'axios';

/**
 * @param {Function} func
 * @param {number} [times]
 * @param {Function} [onError]
 */
export const retryAsync = async (func, times = 1, onError) => {
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
 * @param {Parameters<import('axios').Axios['get']>} args
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const retryGet = (...args) =>
  retryAsync(() => {
    const { timeout } = args[1] || {};
    if (!timeout) return get(...args);
    return new Promise((resolve, reject) => {
      // 再整个 timeout 以防万一，axios 的 timeout 可能会失灵……
      const timeoutId = setTimeout(() => reject(new Error(`timeout of ${timeout}ms exceeded`)), timeout + 1000);
      get(...args)
        .then((...rets) => {
          clearTimeout(timeoutId);
          resolve(...rets);
        })
        .catch(reject);
    });
  }, 3);

/**
 * @param {Parameters<import('axios').Axios['post']>} args
 * @returns {Promise<import('axios').AxiosResponse>}
 */
export const retryPost = (...args) =>
  retryAsync(() => {
    const { timeout } = args[1] || {};
    if (!timeout) return post(...args);
    return new Promise((resolve, reject) => {
      // 再整个 timeout 以防万一，axios 的 timeout 可能会失灵……
      const timeoutId = setTimeout(() => reject(new Error(`timeout of ${timeout}ms exceeded`)), timeout + 1000);
      post(...args)
        .then((...rets) => {
          clearTimeout(timeoutId);
          resolve(...rets);
        })
        .catch(reject);
    });
  }, 3);
