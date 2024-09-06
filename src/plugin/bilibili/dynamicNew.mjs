import { map } from 'lodash-es';
import CQ from '../../utils/CQcode.mjs';
import humanNum from '../../utils/humanNum.mjs';
import logError from '../../utils/logError.mjs';
import { retryGet } from '../../utils/retry.mjs';
import { arrayIf } from '../../utils/spread.mjs';
import { handleImgsByConfig, purgeLinkInText } from './utils.mjs';

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
  MAJOR_TYPE_DRAW: ({ draw: { items } }) => handleImgsByConfig(map(items, 'src')),

  // 视频
  MAJOR_TYPE_ARCHIVE: ({ archive: { cover, aid, bvid, title, stat } }, forPush = false) => [
    CQ.img(cover),
    `av${aid}`,
    CQ.escape(title?.trim()),
    ...arrayIf(`${stat.play}播放 ${stat.danmaku}弹幕`, !forPush),
    `https://www.bilibili.com/video/${bvid}`,
  ],

  // 文章
  MAJOR_TYPE_ARTICLE: ({ article: { covers, id, title, desc } }) => [
    ...(covers.length ? [CQ.img(covers[0])] : []),
    `《${CQ.escape(title?.trim())}》`,
    CQ.escape(desc?.trim()),
    `https://www.bilibili.com/read/cv${id}`,
  ],

  // 音乐
  MAJOR_TYPE_MUSIC: ({ music: { cover, id, title, label } }) => [
    CQ.img(cover),
    `au${id}`,
    CQ.escape(title?.trim()),
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
  MAJOR_TYPE_LIVE_RCMD: ({ live_rcmd: { content } }) => {
    const {
      live_play_info: {
        cover,
        title,
        room_id,
        live_status,
        parent_area_name,
        area_name,
        watched_show: { text_large },
      },
    } = JSON.parse(content);
    return [
      CQ.img(cover),
      CQ.escape(title),
      `房间号：${room_id}`,
      `分区：${parent_area_name}・${area_name ? `${area_name}` : ''}`,
      live_status ? `直播中  ${text_large}` : '未开播',
      `https://live.bilibili.com/${room_id}`,
    ];
  },

  // 通用动态？
  MAJOR_TYPE_OPUS: async ({
    opus: {
      pics,
      summary: { text },
      title,
      fold_action: actions,
      jump_url: url,
    },
  }) => {
    const lines = [];
    if (title) lines.push('', `《${CQ.escape(title.trim())}》`);
    if (actions?.includes('全文')) lines.push('', `全文：https:${url}`);
    if (text) lines.push('', CQ.escape(purgeLinkInText(text.trim())));
    if (pics.length) {
      lines.push('', ...(await handleImgsByConfig(map(pics, 'url'))));
    }
    return lines.slice(1);
  },
};

const formatDynamic = async (item, forPush = false) => {
  const { module_author: author, module_dynamic: dynamic } = item.modules;
  const { dynamicLinkPosition } = global.config.bot.bilibili;

  const link = `https://t.bilibili.com/${item.id_str}`;
  const lines = [`UP：${CQ.escape(author.name)}`];

  if (dynamicLinkPosition !== 'append' && dynamicLinkPosition !== 'none') {
    lines.unshift(link);
  }

  const desc = dynamic?.desc?.text?.trim();
  if (desc) lines.push('', CQ.escape(purgeLinkInText(desc)));

  const major = dynamic?.major;
  if (major && major.type in majorFormatters) {
    lines.push('', ...(await majorFormatters[major.type](major, forPush)));
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

  if (dynamicLinkPosition === 'append') {
    lines.push('', link);
  }

  return lines;
};

export const getDynamicInfoFromItem = async (item, forPush = false) => {
  return {
    id: item.id_str,
    type: item.type,
    isForwardingSelf:
      item.type === 'DYNAMIC_TYPE_FORWARD' && item.modules.module_author.mid === item.orig.modules.module_author.mid,
    text: (await formatDynamic(item, forPush)).join('\n'),
  };
};

export const getDynamicInfo = async (id, forPush = false) => {
  try {
    const { cookie } = global.config.bot.bilibili;
    const {
      data: { data, code, message },
    } = await retryGet('https://api.bilibili.com/x/polymer/web-dynamic/v1/detail', {
      timeout: 10000,
      params: {
        timezone_offset: new Date().getTimezoneOffset(),
        id,
        features: 'itemOpusStyle',
      },
      headers: cookie ? { Cookie: cookie } : {},
    });
    if (code === 4101131 || code === 4101105) {
      return {
        text: '动态不存在',
        reply: true,
      };
    }
    if (code !== 0) {
      return {
        text: `Error: (${code})${message}`,
        reply: true,
      };
    }
    if (!data?.item) {
      return {
        text: 'Error: 无内容',
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
