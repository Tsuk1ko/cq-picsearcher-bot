import { URL } from 'url';
const Axios = require('../axiosProxy');

/**
 * 新浪短网址
 *
 * @param {string} url 长网址
 * @returns 短网址
 */
function shorten(url) {
  const req = `http://api.t.sina.com.cn/short_url/shorten.json?source=3271760578&url_long=${encodeURIComponent(url)}`;
  return Axios.get(req)
    .then(r => {
      const result = r.data[0].url_short;
      return {
        result,
        path: new URL(result).pathname,
        error: false,
      };
    })
    .catch(e => {
      console.error(`${global.getTime()} [error] t.cn shorten`);
      console.error(e);
      return {
        result: url,
        error: true,
      };
    });
}

export default shorten;
