/**
 * 净化链接
 * @param {string} link
 */
export const purgeLink = link => {
  try {
    const url = new URL(link);
    if (url.hostname === 'live.bilibili.com') {
      url.search = '';
      url.hash = '';
      return url.href;
    }
    url.searchParams.delete('spm_id_from');
    return url.href;
  } catch (e) {}
  return link;
};

/**
 * 净化文本中的链接
 * @param {string} text
 */
export const purgeLinkInText = text =>
  text.replace(
    /(?:https?:\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/g,
    url => purgeLink(url)
  );
