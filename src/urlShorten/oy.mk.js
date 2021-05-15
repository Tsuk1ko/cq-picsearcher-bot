import { URL } from 'url';
const Axios = require('../axiosProxy');

/**
 * oy.mk 短网址
 *
 * @param {string} url 长网址
 * @returns 短网址
 */
async function shorten(url) {
  const req = `https://oy.mk/api/insert?url=${encodeURIComponent(url)}`;
  return Axios.get(req)
    .then(r => {
      const result = r.data.data.url;
      return {
        result,
        path: new URL(result).pathname,
        error: false,
      };
    })
    .catch(e => {
      console.error(`${global.getTime()} [error] oy.mk shorten`);
      console.error(e);
      return {
        result: url,
        error: true,
      };
    });
}

export default shorten;
