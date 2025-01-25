import { stringify } from 'qs';
import CQ from '../../utils/CQcode.mjs';
import humanNum from '../../utils/humanNum.mjs';
import logError from '../../utils/logError.mjs';
import { retryGet } from '../../utils/retry.mjs';

const getVideoJumpTimeStr = time => {
  if (!time) return '';
  const h = Math.floor(time / 3600);
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${h > 0 ? `${h}:` : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const getVideoInfo = async (param, videoJump) => {
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

    const videoJumpText = videoJump
      ? `\n空降链接(${getVideoJumpTimeStr(videoJump)})\nhttps://www.bilibili.com/video/${bvid}?t=${videoJump}`
      : '';

    return {
      ids: [aid, bvid],
      text: `${CQ.img(pic)}
av${aid}
${CQ.escape(title)}
UP：${CQ.escape(name)}
${humanNum(view)}播放 ${humanNum(danmaku)}弹幕
https://www.bilibili.com/video/${bvid}${videoJumpText}`,
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
      },
    )
    .catch(e => {
      logError(`[error] bilibili get video info ${keyword}`);
      logError(e);
      return {};
    });
