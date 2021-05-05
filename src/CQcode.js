import _ from 'lodash';

/**
 * 转义
 * @param {string} str 欲转义的字符串
 * @param {boolean} [insideCQ=false] 是否在CQ码内
 */
const escape = (str, insideCQ = false) => {
  const result = str.replace(/&/g, '&amp;').replace(/\[/g, '&#91;').replace(/\]/g, '&#93;');
  if (!insideCQ) return result;
  return result
    .replace(/,/g, '&#44;')
    .replace(/(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g, ' ');
};

/**
 * 反转义
 * @param {string} str 欲反转义的字符串
 */
const unescape = str => str.replace(/&#44;/g, ',').replace(/&#91;/g, '[').replace(/&#93;/g, ']').replace(/&amp;/g, '&');

const escapeInsideCQ = str => escape(String(str), true);

class CQCode {
  constructor(type, obj) {
    this.type = type;
    this.data = new Map();
    if (obj) this.mset(obj);
  }

  /**
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    this.data.set(key, value);
    return this;
  }

  /**
   * @param {{ [key: string]: any }} obj
   */
  mset(obj) {
    Object.entries(obj).forEach(kv => this.set(...kv));
    return this;
  }

  toString() {
    const list = Array.from(this.data.entries())
      .filter(([, v]) => !_.isNil(v))
      .map(kv => kv.map(escapeInsideCQ).join('='));
    list.unshift(`CQ:${this.type}`);
    return `[${list.join(',')}]`;
  }
}

/**
 * CQ码 图片
 * @param {string} file 本地文件路径或URL
 * @param {string} type 类型
 */
const img = (file, type = null) => new CQCode('image', { file, type }).toString();

/**
 * CQ码 Base64 图片
 * @param {string} base64 图片 Base64
 */
const img64 = (base64, type = null) => new CQCode('image', { file: `base64://${base64}`, type }).toString();

/**
 * CQ码 视频
 * @param {string} file 本地文件路径或URL
 */
const video = file => new CQCode('video', { file }).toString();

/**
 * CQ码 分享链接
 * @param {string} url 链接
 * @param {string} title 标题
 * @param {string} content 内容
 * @param {string} image 图片URL
 */
const share = (url, title, content, image) => new CQCode('share', { url, title, content, image }).toString();

/**
 * CQ码 @
 * @param {number} qq
 */
const at = qq => new CQCode('at', { qq }).toString();

/**
 * CQ码 回复
 * @param {number} id 消息ID
 */
const reply = id => new CQCode('reply', { id }).toString();

export default {
  escape,
  unescape,
  share,
  img,
  img64,
  video,
  at,
  reply,
};
