import CQ from '../../utils/CQcode.mjs';
import humanNum from '../../utils/humanNum.mjs';
import logError from '../../utils/logError.mjs';
import { retryGet } from '../../utils/retry.mjs';
import { purgeLinkInText } from './utils.mjs';

const additionalFormatters = {
  // 投票
  ADDITIONAL_TYPE_VOTE: ({ vote: { desc, end_time, join_num } }) => [
    `【投票】${CQ.escape(desc)}`,
    `截止日期：${new Date(end_time * 1000).toLocaleString()}`,
    `参与人数：${humanNum(join_num)}`,
    '投票详情见原动态',
  ],

  // 预约
  ADDITIONAL_TYPE_RESERVE: ({ reserve: { title, desc1, desc2 } }) => {
    const lines = [CQ.escape(title)];
    const desc = [desc1?.text, desc2?.text].filter(v => v);
    if (desc.length > 0) lines.push(CQ.escape(desc.join('  ')));
    return lines;
  },
};

const majorFormatters = {
  // 图片
  MAJOR_TYPE_DRAW: async ({ draw: { items } }) => {
    const { dynamicImgPreDl, imgPreDlTimeout } = global.config.bot.bilibili;
    return dynamicImgPreDl
      ? await Promise.all(items.map(({ src }) => CQ.imgPreDl(src, undefined, { timeout: imgPreDlTimeout * 1000 })))
      : items.map(({ src }) => CQ.img(src));
  },

  // 视频
  MAJOR_TYPE_ARCHIVE: ({ archive: { cover, aid, bvid, title, stat } }) => [
    CQ.img(cover),
    `av${aid}`,
    CQ.escape(title.trim()),
    `${humanNum(stat.play)}播放 ${humanNum(stat.danmaku)}弹幕`,
    `https://www.bilibili.com/video/${bvid}`,
  ],

  // 文章
  MAJOR_TYPE_ARTICLE: ({ article: { covers, id, title, desc } }) => [
    ...(covers.length ? [CQ.img(covers[0])] : []),
    CQ.escape(title.trim()),
    CQ.escape(desc.trim()),
    `https://www.bilibili.com/read/cv${id}`,
  ],

  // 音乐
  MAJOR_TYPE_MUSIC: ({ music: { cover, id, title, label } }) => [
    CQ.img(cover),
    `au${id}`,
    CQ.escape(title.trim()),
    `分类：${label}`,
    `https://www.bilibili.com/audio/au${id}`,
  ],

  // 直播
  MAJOR_TYPE_LIVE: ({ live: { cover, title, id, live_state, desc_first, desc_second } }) => [
    CQ.img(cover),
    CQ.escape(title),
    `房间号：${id}`,
    `分区：${desc_first}`,
    live_state ? `直播中  ${desc_second}` : '未开播',
    `https://live.bilibili.com/${id}`,
  ],
};

const formatDynamic = async item => {
  const { module_author: author, module_dynamic: dynamic } = item.modules;
  const lines = [`https://t.bilibili.com/${item.id_str}`, `UP：${CQ.escape(author.name)}`];

  const desc = dynamic?.desc?.text?.trim();
  if (desc) lines.push('', CQ.escape(purgeLinkInText(desc)));

  const major = dynamic?.major;
  if (major && major.type in majorFormatters) {
    lines.push('', ...(await majorFormatters[major.type](major)));
  }

  const additional = dynamic?.additional;
  if (additional && additional.type in additionalFormatters) {
    lines.push('', ...(await additionalFormatters[additional.type](additional)));
  }

  if (item.type === 'DYNAMIC_TYPE_FORWARD') {
    if (item.orig.type === 'DYNAMIC_TYPE_NONE') {
      lines.push('', '【转发的源动态已被作者删除】');
    } else {
      lines.push('', ...(await formatDynamic(item.orig)));
    }
  }

  return lines;
};

export const getDynamicInfo = async id => {
  try {
    const {
      data: { data },
    } = await retryGet('https://api.bilibili.com/x/polymer/web-dynamic/v1/detail', {
      timeout: 10000,
      params: {
        timezone_offset: new Date().getTimezoneOffset(),
        id,
        features: 'itemOpusStyle',
      },
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
      },
    });
    if (!data?.item) {
      return {
        text: '动态不存在',
        reply: true,
      };
    }
    const lines = await formatDynamic(data.item);
    return {
      text: lines.join('\n'),
      reply: false,
    };
  } catch (e) {
    logError(`[error] bilibili get dynamic new info ${id}`);
    logError(e);
    return null;
  }
};
