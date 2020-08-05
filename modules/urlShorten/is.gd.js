import Axios from '../axiosProxy';
import Url from 'url';

/**
 * is.gd 短网址
 *
 * @param {string} url 长网址
 * @returns 短网址
 */
function shorten(url) {
  const req = `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`;
  return Axios.get(req)
    .then(r => {
      const result = r.data;
      return {
        result,
        path: Url.parse(result).path,
        error: false,
      };
    })
    .catch(e => {
      console.error(`${new Date().toLocaleString()} [error] is.gd shorten\n${e}`);
      return {
        result: url,
        error: true,
      };
    });
}

export default shorten;
