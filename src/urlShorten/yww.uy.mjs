import Axios from '../utils/axiosProxy.mjs';
import logError from '../utils/logError.mjs';

/**
 * yww.uy 短网址
 *
 * @param {string} url 长网址
 * @returns 短网址
 */
export default url =>
  Axios.post('https://yww.uy/shorten', { url })
    .then(r => ({
      result: r.data.url,
      error: false,
    }))
    .catch(e => {
      console.error('[error] yww.uy shorten');
      logError(e);
      return {
        result: url,
        error: true,
      };
    });
