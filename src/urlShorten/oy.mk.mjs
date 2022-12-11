import logError from '../utils/logError.mjs';
import Axios from '../utils/axiosProxy.mjs';

/**
 * oy.mk 短网址
 *
 * @param {string} url 长网址
 * @returns 短网址
 */
export default url =>
  Axios.get(`https://oy.mk/api/insert?url=${encodeURIComponent(url)}`)
    .then(r => ({
      result: r.data.data.url,
      error: false,
    }))
    .catch(e => {
      console.error(`${global.getTime()} [error] oy.mk shorten`);
      logError(e);
      return {
        result: url,
        error: true,
      };
    });
