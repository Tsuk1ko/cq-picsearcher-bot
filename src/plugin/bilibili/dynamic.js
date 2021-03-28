import { get } from 'axios';
import CQ from '../../CQcode';
import logError from '../../logError';

const dynamic2msg = ({ dyid, type, uname, card: { item, bvid, dynamic, pic, title, id, summary, image_urls } }) => {
  const lines = [`https://t.bilibili.com/${dyid}`, `UP：${uname}`, ''];
  switch (type) {
    // 图文动态
    case 2:
      const { description, pictures } = item;
      lines.push(description.trim());
      lines.push(...pictures.map(({ img_src }) => CQ.img(img_src)));
      break;

    // 文字动态
    case 1: // 转发
    case 4:
      const { content } = item;
      lines.push(content.trim());
      break;

    // 视频
    case 8:
      lines.push(dynamic.trim());
      lines.push(CQ.img(pic));
      lines.push(title.trim());
      lines.push(`https://www.bilibili.com/video/${bvid}`);
      break;

    // 文章
    case 64:
      if (image_urls.length) lines.push(CQ.img(image_urls[0]));
      lines.push(title.trim(), summary.trim());
      lines.push(`https://www.bilibili.com/read/cv${id}`);
      break;

    // 未知
    default:
      return `未知的动态类型 type=${type}`;
  }
  return lines.join('\n').trim();
};

export const getDynamicInfo = async id => {
  try {
    const {
      data: { data },
    } = await get(`https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?dynamic_id=${id}`);
    const dynamic = (({
      card,
      desc: {
        type,
        dynamic_id_str,
        bvid,
        user_profile: {
          info: { uname },
        },
      },
    }) => ({
      dyid: dynamic_id_str,
      type,
      uname,
      card: { bvid, ...JSON.parse(card) },
    }))(data.card);
    return dynamic2msg(dynamic);
  } catch (e) {
    logError(`${global.getTime()} [error] bilibili get dynamic info ${id}`);
    logError(e);
    return null;
  }
};
