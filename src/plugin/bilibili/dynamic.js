import _ from 'lodash';
import CQ from '../../CQcode';
import logError from '../../logError';
import { retryGet } from '../../utils/retry';

const parseDynamicCard = ({
  card,
  desc: {
    type,
    dynamic_id_str,
    bvid,
    origin,
    user_profile: {
      info: { uname },
    },
  },
}) => {
  const data = {
    dyid: dynamic_id_str,
    type,
    uname,
    card: { bvid, ...JSON.parse(card) },
  };
  if (origin) {
    data.origin = {
      desc: {
        ...origin,
        user_profile: data.card.origin_user,
      },
      card: data.card.origin,
    };
  }
  return data;
};

const dynamicCard2msg = async (card, forPush = false) => {
  const config = global.config.bot.bilibili;
  const {
    dyid,
    type,
    uname,
    origin,
    card: { item, bvid, dynamic, pic, title, id, summary, image_urls, sketch },
  } = parseDynamicCard(card);
  const lines = [`https://t.bilibili.com/${dyid}`, `UP：${uname}`, ''];
  switch (type) {
    // 转发
    case 1:
      if (forPush && item.content.includes('详情请点击互动抽奖查看')) return null;
      lines.push(item.content.trim());
      lines.push(
        '',
        (await dynamicCard2msg(origin, forPush).catch(e => {
          logError(`${global.getTime()} [error] bilibili parse original dynamic`, card);
          logError(e);
          return null;
        })) || `https://t.bilibili.com/${origin.dynamic_id_str}`
      );
      break;

    // 图文动态
    case 2:
      const { description, pictures } = item;
      lines.push(
        description.trim(),
        ...(config.dynamicImgPreDl
          ? await Promise.all(
              pictures.map(({ img_src }) => CQ.imgPreDl(img_src, undefined, { timeout: config.imgPreDlTimeout * 1000 }))
            )
          : pictures.map(({ img_src }) => CQ.img(img_src)))
      );
      break;

    // 文字动态
    case 4:
      lines.push(item.content.trim());
      break;

    // 视频
    case 8:
      if (dynamic) lines.push(dynamic.trim());
      lines.push(CQ.img(pic), title.trim(), `https://www.bilibili.com/video/${bvid}`);
      break;

    // 文章
    case 64:
      if (image_urls.length) lines.push(CQ.img(image_urls[0]));
      lines.push(title.trim(), summary.trim(), `https://www.bilibili.com/read/cv${id}`);
      break;

    // 类似外部分享的东西
    case 2048:
      const { title: sTitle, cover_url, target_url } = sketch;
      lines.push(CQ.img(cover_url), sTitle, target_url);
      break;

    // 未知
    default:
      lines.push(`未知的动态类型 type=${type}`);
  }
  return lines.join('\n').trim();
};

export const getDynamicInfo = async id => {
  try {
    const {
      data: {
        data: { card },
      },
    } = await retryGet(`https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/get_dynamic_detail?dynamic_id=${id}`, {
      timeout: 10000,
    });
    return dynamicCard2msg(card);
  } catch (e) {
    logError(`${global.getTime()} [error] bilibili get dynamic info ${id}`);
    logError(e);
    return null;
  }
};

const sendedDynamicIdsMap = {};

export const getUserNewDynamicsInfo = async uid => {
  try {
    const {
      data: {
        data: { cards },
      },
    } = await retryGet(`https://api.vc.bilibili.com/dynamic_svr/v1/dynamic_svr/space_history?host_uid=${uid}`, {
      timeout: 10000,
    });
    const sendedDids = sendedDynamicIdsMap[uid] || [];
    const curDids = _.map(cards, 'desc.dynamic_id_str');
    // 拉到的有问题
    if (!curDids.length) {
      logError(`${global.getTime()} [error] bilibili get user dynamics info ${uid}: no dynamic`);
      logError(JSON.stringify(cards));
      return;
    }
    sendedDynamicIdsMap[uid] = curDids;
    // 是首次拉取
    if (!sendedDids.length) return;
    // 没发过的
    const newDids = new Set(_.difference(curDids, sendedDids));
    return (
      await Promise.all(
        cards.filter(({ desc: { dynamic_id_str: did } }) => newDids.has(did)).map(card => dynamicCard2msg(card, true))
      )
    ).filter(Boolean);
  } catch (e) {
    logError(`${global.getTime()} [error] bilibili get user dynamics info ${uid}`);
    logError(e);
    return null;
  }
};
