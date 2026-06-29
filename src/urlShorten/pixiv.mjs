/**
 * pixiv 短链接
 *
 * @export
 * @param {string} url
 */
export default function pixivShorten(url) {
  const pidSearch = /pixiv.+illust_id=(\d+)/.exec(url) || /pixiv.+artworks\/(\d+)/.exec(url);
  if (pidSearch) return `https://pixiv.net/i/${pidSearch[1]}`;
  const uidSearch = /pixiv.+member\.php\?id=(\d+)/.exec(url) || /pixiv.+users\/(\d+)/.exec(url);
  if (uidSearch) return `https://pixiv.net/u/${uidSearch[1]}`;
  return url;
}
