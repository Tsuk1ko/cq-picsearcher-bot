import { URL } from 'url';
const { get } = require('../axiosProxy');

/**
 * 新浪短网址
 *
 * @param {string} url 长网址
 * @returns 短网址
 */
function shorten(url) {
  const req = `http://api.t.sina.com.cn/short_url/shorten.json?source=3271760578&url_long=${encodeURIComponent(url)}`;
  return get(req)
    .then(r => {
      const result = r.data[0].url_short;
      return {
        result,
        path: new URL(result).pathname,
        error: false,
      };
    })
    .catch(e => {
      console.error(`${new Date().toLocaleString()} [error] t.cn shorten\n${e}`);
      return {
        result: url,
        error: true,
      };
    });
}

export default shorten;
