import Axios from 'axios';

/**
 * 新浪短网址
 *
 * @param {string} url 长网址
 * @returns 短网址
 */
function shorten(url) {
    const req = `http://api.t.sina.com.cn/short_url/shorten.json?source=3271760578&url_long=${encodeURIComponent(url)}`;
    return Axios.get(req)
        .then(r => r.data[0].url_short)
        .catch(() => url);
}

export default shorten;
