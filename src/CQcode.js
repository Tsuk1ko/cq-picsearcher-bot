/**
 * 转义
 *
 * @param {string} str 欲转义的字符串
 * @param {boolean} [insideCQ=false] 是否在CQ码内
 * @returns 转义后的字符串
 */
function escape(str, insideCQ = false) {
  let temp = str.replace(/&/g, '&amp;').replace(/\[/g, '&#91;').replace(/\]/g, '&#93;');
  if (insideCQ) {
    temp = temp
      .replace(/,/g, '&#44;')
      .replace(/(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g, ' ');
  }
  return temp;
}

/**
 * 反转义
 *
 * @param {string} str 欲反转义的字符串
 * @returns 反转义后的字符串
 */
function unescape(str) {
  return str.replace(/&#44;/g, ',').replace(/&#91;/g, '[').replace(/&#93;/g, ']').replace(/&amp;/g, '&');
}

/**
 * CQ码 图片
 *
 * @param {string} file 本地文件路径或URL
 * @param {string} type 类型
 * @returns CQ码 图片
 */
function img(file, type = null) {
  const list = ['CQ:image', `file=${escape(file, true)}`];
  if (type) list.push(`type=${type}`);
  return `[${list.join(',')}]`;
}

/**
 * CQ码 Base64 图片
 *
 * @param {string} base64 图片 Base64
 * @returns CQ码 图片
 */
function img64(base64, type = null) {
  const list = ['CQ:image', `file=base64://${base64}`];
  if (type) list.push(`type=${type}`);
  return `[${list.join(',')}]`;
}

/**
 * CQ码 分享链接
 *
 * @param {string} url 链接
 * @param {string} title 标题
 * @param {string} content 内容
 * @param {string} image 图片URL
 * @returns CQ码 分享链接
 */
function share(url, title, content, image) {
  return `[CQ:share,url=${escape(url, true)},title=${escape(title, true)},content=${escape(
    content,
    true
  )},image=${escape(image, true)}]`;
}

/**
 * CQ码 @
 *
 * @param {number} qq
 * @returns CQ码 @
 */
function at(qq) {
  return `[CQ:at,qq=${qq}]`;
}

/**
 * CQ码 回复
 *
 * @param {number} id 消息ID
 * @returns CQ码 回复
 */
function reply(id) {
  return `[CQ:reply,id=${id}]`;
}

export default {
  escape,
  unescape,
  share,
  img,
  img64,
  at,
  reply,
};
