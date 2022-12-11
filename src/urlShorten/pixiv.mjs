/**
 * pixiv 短链接
 *
 * @export
 * @param {string} url
 * @returns
 */
export default function pixivShorten(url) {
  const pidSearch = /pixiv.+illust_id=([0-9]+)/.exec(url) || /pixiv.+artworks\/([0-9]+)/.exec(url);
  if (pidSearch) return 'https://pixiv.net/i/' + pidSearch[1];
  const uidSearch = /pixiv.+member\.php\?id=([0-9]+)/.exec(url) || /pixiv.+users\/([0-9]+)/.exec(url);
  if (uidSearch) return 'https://pixiv.net/u/' + uidSearch[1];
  return url;
}
