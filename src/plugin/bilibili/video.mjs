import { stringify } from 'qs';
import CQ from '../../utils/CQcode.mjs';
import humanNum from '../../utils/humanNum.mjs';
import logError from '../../utils/logError.mjs';
import { retryGet } from '../../utils/retry.mjs';

const getVideoJumpStr = ({ p, t }) => {
  const parts = [];
  if (p) parts.push(`p${p}`);
  if (t) {
    const h = Math.floor(t / 3600);
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    parts.push(`${h > 0 ? `${h}:` : ''}${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
  }
  return parts.join(', ');
};

export const getVideoInfo = async (params, jumpParams) => {
  try {
    const { data } = await retryGet(`https://api.bilibili.com/x/web-interface/view?${stringify(params)}`, {
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

    const videoJumpText = jumpParams
      ? `\n空降链接 (${getVideoJumpStr(jumpParams)})\nhttps://www.bilibili.com/video/${bvid}?${stringify(jumpParams)}`
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
    logError(`[error] bilibili get video info ${params}`);
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
