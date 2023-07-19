import CQ from '../../utils/CQcode.mjs';
import humanNum from '../../utils/humanNum.mjs';
import logError from '../../utils/logError.mjs';
import { retryGet } from '../../utils/retry.mjs';
import { DEDE_USER_COOKIE, USER_AGENT } from './const.mjs';
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
    `《${CQ.escape(title.trim())}》`,
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

  // 通用动态？
  MAJOR_TYPE_OPUS: ({
    opus: {
      jump_url,
      pics,
      summary: { text },
      title,
    },
  }) => [
    ...(pics.length ? [CQ.img(pics[0].url)] : []),
    `《${CQ.escape(title.trim())}》`,
    CQ.escape(text.trim()),
    jump_url.replace(/^\/\//, 'https://'),
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

export const getDynamicInfoFromItem = async item => {
  return {
    type: item.type,
    text: (await formatDynamic(item)).join('\n'),
  };
};

export const getDynamicInfo = async id => {
  try {
    const {
      data: { data, code, message },
    } = await retryGet('https://api.bilibili.com/x/polymer/web-dynamic/v1/detail', {
      timeout: 10000,
      params: {
        timezone_offset: new Date().getTimezoneOffset(),
        id,
        features: 'itemOpusStyle',
      },
      headers: {
        Cookie: DEDE_USER_COOKIE,
        'User-Agent': USER_AGENT,
      },
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

getDynamicInfoFromItem({
  basic: {
    comment_id_str: '25109910',
    comment_type: 12,
    like_icon: {
      action_url: 'https://i0.hdslb.com/bfs/garb/item/7f638260e347c475e39bf1a40fcc1e54786ba7ac.bin',
      end_url: '',
      id: 2874,
      start_url: '',
    },
    rid_str: '25109910',
  },
  id_str: '819835430626131986',
  modules: {
    module_author: {
      avatar: {
        container_size: {
          height: 1.35,
          width: 1.35,
        },
        fallback_layers: {
          is_critical_group: true,
          layers: [
            {
              general_spec: {
                pos_spec: {
                  axis_x: 0.675,
                  axis_y: 0.675,
                  coordinate_pos: 2,
                },
                render_spec: {
                  opacity: 1,
                },
                size_spec: {
                  height: 1,
                  width: 1,
                },
              },
              layer_config: {
                is_critical: true,
                tags: {
                  AVATAR_LAYER: {},
                  GENERAL_CFG: {
                    config_type: 1,
                    general_config: {
                      web_css_style: {
                        borderRadius: '50%',
                      },
                    },
                  },
                },
              },
              resource: {
                res_image: {
                  image_src: {
                    placeholder: 6,
                    remote: {
                      bfs_style: 'widget-layer-avatar',
                      url: 'https://i2.hdslb.com/bfs/face/57b6e8c16b909a49bfc8d8394d946f908cabe728.jpg',
                    },
                    src_type: 1,
                  },
                },
                res_type: 3,
              },
              visible: true,
            },
            {
              general_spec: {
                pos_spec: {
                  axis_x: 0.8000000000000002,
                  axis_y: 0.8000000000000002,
                  coordinate_pos: 1,
                },
                render_spec: {
                  opacity: 1,
                },
                size_spec: {
                  height: 0.41666666666666663,
                  width: 0.41666666666666663,
                },
              },
              layer_config: {
                tags: {
                  GENERAL_CFG: {
                    config_type: 1,
                    general_config: {
                      web_css_style: {
                        'background-color': 'rgb(255,255,255)',
                        border: '2px solid rgba(255,255,255,1)',
                        borderRadius: '50%',
                        boxSizing: 'border-box',
                      },
                    },
                  },
                  ICON_LAYER: {},
                },
              },
              resource: {
                res_image: {
                  image_src: {
                    local: 4,
                    src_type: 2,
                  },
                },
                res_type: 3,
              },
              visible: true,
            },
          ],
        },
        mid: '1340190821',
      },
      face: 'https://i2.hdslb.com/bfs/face/57b6e8c16b909a49bfc8d8394d946f908cabe728.jpg',
      face_nft: false,
      following: true,
      jump_url: '//space.bilibili.com/1340190821/dynamic',
      label: '',
      mid: 1340190821,
      name: '崩坏星穹铁道',
      official_verify: {
        desc: '',
        type: 1,
      },
      pendant: {
        expire: 0,
        image: '',
        image_enhance: '',
        image_enhance_frame: '',
        name: '',
        pid: 0,
      },
      pub_action: '投稿了文章',
      pub_location_text: '',
      pub_time: '3小时前',
      pub_ts: 1689721211,
      type: 'AUTHOR_TYPE_NORMAL',
      vip: {
        avatar_subscript: 1,
        avatar_subscript_url: '',
        due_date: 1699372800000,
        label: {
          bg_color: '#FB7299',
          bg_style: 1,
          border_color: '',
          img_label_uri_hans: '',
          img_label_uri_hans_static: 'https://i0.hdslb.com/bfs/vip/8d4f8bfc713826a5412a0a27eaaac4d6b9ede1d9.png',
          img_label_uri_hant: '',
          img_label_uri_hant_static:
            'https://i0.hdslb.com/bfs/activity-plat/static/20220614/e369244d0b14644f5e1a06431e22a4d5/VEW8fCC0hg.png',
          label_theme: 'annual_vip',
          path: '',
          text: '年度大会员',
          text_color: '#FFFFFF',
          use_img_label: true,
        },
        nickname_color: '#FB7299',
        status: 1,
        theme_type: 0,
        type: 2,
      },
    },
    module_dynamic: {
      additional: {
        common: {
          button: {
            jump_style: {
              icon_url: '',
              text: '进入',
            },
            jump_url: 'https://www.biligame.com/detail?id=107800&sourceFrom=1005',
            type: 1,
          },
          cover: 'https://i0.hdslb.com/bfs/game/b108e3f091dad6d43cd1cd35c119216e87011a8f.png',
          desc1: '角色扮演/冒险',
          desc2: '全新1.1版本「银河漫游」现已推出！',
          head_text: '相关游戏',
          id_str: '107800',
          jump_url: 'https://www.biligame.com/detail?id=107800&sourceFrom=1005',
          style: 1,
          sub_type: 'game',
          title: '崩坏：星穹铁道',
        },
        type: 'ADDITIONAL_TYPE_COMMON',
      },
      desc: null,
      major: {
        opus: {
          jump_url: '//www.bilibili.com/read/cv25109910',
          pics: [
            {
              height: 264,
              size: 293.6083984375,
              url: 'https://i0.hdslb.com/bfs/article/a9db32a2fb0880a071cb1110aa2997c5976da04d.png',
              width: 900,
            },
          ],
          summary: {
            rich_text_nodes: [
              {
                orig_text:
                  '万物终有尽头，毋论仙凡。这绝非不仁的天罚，而是宽赦。亲爱的开拓者：欢迎来到1.2版本「仙骸有终」！▌更新及补偿说明■更新时间2023/07/19 06:00开始，预计5个小时完成。■补偿说明● 停服更新补偿补偿内容：星琼*300补偿对象：2023/07/19 06:00 前，开拓等级≥4级的开拓者※领取时间截至1.3版本停服维护前。● 问题修复补偿补偿内容：星琼*300补偿对象：2023/07/19 06:00 前，开拓等级≥4级的开拓者※请开拓者于2023/08/18 23:59前上线收取邮件。以上补偿',
                text: '万物终有尽头，毋论仙凡。这绝非不仁的天罚，而是宽赦。亲爱的开拓者：欢迎来到1.2版本「仙骸有终」！▌更新及补偿说明■更新时间2023/07/19 06:00开始，预计5个小时完成。■补偿说明● 停服更新补偿补偿内容：星琼*300补偿对象：2023/07/19 06:00 前，开拓等级≥4级的开拓者※领取时间截至1.3版本停服维护前。● 问题修复补偿补偿内容：星琼*300补偿对象：2023/07/19 06:00 前，开拓等级≥4级的开拓者※请开拓者于2023/08/18 23:59前上线收取邮件。以上补偿',
                type: 'RICH_TEXT_NODE_TYPE_TEXT',
              },
            ],
            text: '万物终有尽头，毋论仙凡。这绝非不仁的天罚，而是宽赦。亲爱的开拓者：欢迎来到1.2版本「仙骸有终」！▌更新及补偿说明■更新时间2023/07/19 06:00开始，预计5个小时完成。■补偿说明● 停服更新补偿补偿内容：星琼*300补偿对象：2023/07/19 06:00 前，开拓等级≥4级的开拓者※领取时间截至1.3版本停服维护前。● 问题修复补偿补偿内容：星琼*300补偿对象：2023/07/19 06:00 前，开拓等级≥4级的开拓者※请开拓者于2023/08/18 23:59前上线收取邮件。以上补偿',
          },
          title: '1.2版本「仙骸有终」版本更新概览',
        },
        type: 'MAJOR_TYPE_OPUS',
      },
      topic: null,
    },
    module_interaction: {
      items: [
        {
          desc: {
            rich_text_nodes: [
              {
                orig_text: '诙谐Hysterics：',
                rid: '2318435',
                text: '诙谐Hysterics：',
                type: 'RICH_TEXT_NODE_TYPE_AT',
              },
              {
                orig_text:
                  '优化了战斗中开启自动战斗时，角色「布洛妮娅（同谐•风）」和「停云（同谐•雷）」的自动施放技能的逻辑。',
                text: '优化了战斗中开启自动战斗时，角色「布洛妮娅（同谐•风）」和「停云（同谐•雷）」的自动施放技能的逻辑。',
                type: 'RICH_TEXT_NODE_TYPE_TEXT',
              },
            ],
            text: '优化了战斗中开启自动战斗时，角色「布洛妮娅（同谐•风）」和「停云（同谐•雷）」的自动施放技能的逻辑。',
          },
          type: 1,
        },
      ],
    },
    module_more: {
      three_point_items: [
        {
          label: '取消关注',
          type: 'THREE_POINT_FOLLOWING',
        },
        {
          label: '举报',
          type: 'THREE_POINT_REPORT',
        },
      ],
    },
    module_stat: {
      comment: {
        count: 3419,
        forbidden: false,
      },
      forward: {
        count: 45,
        forbidden: false,
      },
      like: {
        count: 20151,
        forbidden: false,
        status: false,
      },
    },
  },
  type: 'DYNAMIC_TYPE_ARTICLE',
  visible: true,
}).then(console.log);
