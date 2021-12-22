import _ from 'lodash';
import logError from './logError';
import { createCache, getCache } from './utils/cache';
import { retryGet } from './utils/retry';
import promiseLimit from 'promise-limit';

const dlImgLimit = promiseLimit(4);

class CQCode {
  /**
   * @param {string} type
   * @param {Record<string, any>} data
   */
  constructor(type, data) {
    this.type = type;
    this.data = data ? new Map(Object.entries(data)) : new Map();
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
   * @param {Record<string, any>} obj
   */
  mset(obj) {
    Object.entries(obj).forEach(kv => this.set(...kv));
    return this;
  }

  toString() {
    const list = Array.from(this.data.entries())
      .filter(([, v]) => !_.isNil(v))
      .map(kv => kv.map(CQCode.escapeInsideCQ).join('='));
    list.unshift(`CQ:${this.type}`);
    return `[${list.join(',')}]`;
  }

  /**
   * @param {string[]} keys
   */
  pickData(keys) {
    return _.pick(Object.fromEntries(this.data.entries()), keys);
  }

  /**
   * @param {string} str
   */
  static from(str) {
    const reg = /\[CQ:([^,[\]]+)((?:,[^,=[\]]+=[^,[\]]*)*)\]/g;
    const result = [];
    // eslint-disable-next-line space-in-parens
    for (let match; (match = reg.exec(str)); ) {
      const [, type, dataStr] = match;
      const data = _.transform(
        _.filter(dataStr.split(',')),
        (obj, kv) => {
          const [key, ...value] = kv.split('=');
          obj[CQCode.unescape(key)] = CQCode.unescape(value.join('='));
        },
        {}
      );
      result.push(new CQCode(type, data));
    }
    return result;
  }

  /**
   * 转义
   * @param {string} str 欲转义的字符串
   * @param {boolean} [insideCQ=false] 是否在CQ码内
   */
  static escape(str, insideCQ = false) {
    const result = str.replace(/&/g, '&amp;').replace(/\[/g, '&#91;').replace(/\]/g, '&#93;');
    if (!insideCQ) return result;
    return result
      .replace(/,/g, '&#44;')
      .replace(/(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g, ' ');
  }

  /**
   * 反转义
   * @param {string} str 欲反转义的字符串
   */
  static unescape(str) {
    return str.replace(/&#44;/g, ',').replace(/&#91;/g, '[').replace(/&#93;/g, ']').replace(/&amp;/g, '&');
  }

  static escapeInsideCQ(str) {
    return CQCode.escape(String(str), true);
  }

  /**
   * CQ码 图片
   * @param {string} file 本地文件路径或URL
   * @param {'flash'|'show'} [type] 类型
   */
  static img(file, type) {
    return new CQCode('image', { file, type }).toString();
  }

  /**
   * CQ码 图片 下载再发送
   * @param {string} url 本地文件路径或URL
   * @param {'flash'|'show'} [type] 类型
   * @param {import('axios').AxiosRequestConfig} [config] Axios 配置
   */
  static async imgPreDl(url, type, config = {}) {
    try {
      let path = getCache(url);
      if (!path) {
        const { data } = await dlImgLimit(() => retryGet(url, { responseType: 'arraybuffer', ...config }));
        path = createCache(url, data);
      }
      if (!path.startsWith('/')) path = `/${path}`;
      return new CQCode('image', { file: `file://${path}`, type }).toString();
    } catch (e) {
      logError(`${global.getTime()} [error] cq img pre-download`);
      logError(e);
    }
    return new CQCode('image', { file: url, type }).toString();
  }

  /**
   * CQ码 Base64 图片
   * @param {string} base64 图片 Base64
   * @param {'flash'|'show'} [type] 类型
   */
  static img64(base64, type) {
    return new CQCode('image', { file: `base64://${base64}`, type }).toString();
  }

  /**
   * CQ码 视频
   * @param {string} file 本地文件路径或URL
   * @param {string} cover 本地文件路径或URL
   */
  static video(file, cover) {
    return new CQCode('video', { file, cover }).toString();
  }

  /**
   * CQ码 分享链接
   * @param {string} url 链接
   * @param {string} title 标题
   * @param {string} content 内容
   * @param {string} image 图片URL
   */
  static share(url, title, content, image) {
    return new CQCode('share', { url, title, content, image }).toString();
  }

  /**
   * CQ码 @
   * @param {number} qq
   */
  static at(qq) {
    return new CQCode('at', { qq }).toString();
  }

  /**
   * CQ码 回复
   * @param {number} id 消息ID
   */
  static reply(id) {
    return new CQCode('reply', { id }).toString();
  }
}

export default CQCode;
