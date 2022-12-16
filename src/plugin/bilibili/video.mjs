import { stringify } from 'qs';
import CQ from '../../utils/CQcode.mjs';
import humanNum from '../../utils/humanNum.mjs';
import logError from '../../utils/logError.mjs';
import { retryGet } from '../../utils/retry.mjs';

export const getVideoInfo = async param => {
  try {
    const { data } = await retryGet(`https://api.bilibili.com/x/web-interface/view?${stringify(param)}`, {
      timeout: 10000,
    });
    if (data.code === -404) return { text: '该视频已被删除', reply: true };
    if (data.code !== 0) return { text: data.message, reply: true };

    const {
      data: {
        bvid,
        aid,
        pic,
        title,
        owner: { name },
        stat: { view, danmaku },
      },
    } = data;
    return {
      ids: [aid, bvid],
      text: `${CQ.img(pic)}
av${aid}
${CQ.escape(title)}
UP：${CQ.escape(name)}
${humanNum(view)}播放 ${humanNum(danmaku)}弹幕
https://www.bilibili.com/video/${bvid}`,
    };
  } catch (e) {
    logError(`[error] bilibili get video info ${param}`);
    logError(e);
    return {};
  }
};

/** @deprecated */
export const getSearchVideoInfo = keyword =>
  retryGet(`https://api.bilibili.com/x/web-interface/search/all/v2?${stringify({ keyword })}`, { timeout: 10000 })
    .then(
      ({
        data: {
          data: { result },
        },
      }) => {
        const videos = result.find(({ result_type: rt }) => rt === 'video').data;
        if (videos.length === 0) return null;
        const { author, aid, bvid, title, pic, play, video_review } = videos[0];
        return {
          ids: [aid, bvid],
          reply: `${CQ.img(`http:${pic}`)}
（搜索）av${aid}
${CQ.escape(title.replace(/<([^>]+?)[^>]+>(.*?)<\/\1>/g, '$2'))}
UP：${CQ.escape(author)}
${humanNum(play)}播放 ${humanNum(video_review)}弹幕
https://www.bilibili.com/video/${bvid}`,
        };
      }
    )
    .catch(e => {
      logError(`[error] bilibili get video info ${keyword}`);
      logError(e);
      return {};
    });
