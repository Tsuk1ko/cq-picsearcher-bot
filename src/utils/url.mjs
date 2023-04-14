import pixivShorten from '../urlShorten/pixiv.mjs';

const bannedHosts = [
  'danbooru.donmai.us',
  'konachan.com',
  // 'www.fanbox.cc',
  // 'pixiv.net',
];

/**
 * 链接混淆
 *
 * @param {string} url
 * @returns
 */
export function confuseURL(url) {
  url = pixivShorten(url);
  if (global.config.bot.handleBannedHosts) {
    for (const host of bannedHosts) {
      if (url.includes(host)) {
        return global.config.bot.handleBannedHostsWithLegacyMethod
          ? url.replace(/^https?:\/\//, '').replace(host, host.replace(/\./g, '.删'))
          : url.replace('//', '//\u200B').replace(host, host.replace(/\./g, '.\u200B'));
      }
    }
  }
  return url;
}
