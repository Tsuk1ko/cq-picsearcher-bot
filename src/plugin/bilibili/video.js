import { stringify } from 'qs';
import CQ from '../../CQcode';
import logError from '../../logError';
import humanNum from '../../utils/humanNum';
import { retryGet } from '../../utils/retry';

export const getVideoInfo = param => {
  return retryGet(`https://api.bilibili.com/x/web-interface/view?${stringify(param)}`, { timeout: 10000 })
    .then(
      ({
        data: {
          data: {
            bvid,
            aid,
            pic,
            title,
            owner: { name },
            stat: { view, danmaku },
          },
        },
      }) => ({
        ids: [aid, bvid],
        reply: `${CQ.img(pic)}
av${aid}
${CQ.escape(title)}
UP：${CQ.escape(name)}
${humanNum(view)}播放 ${humanNum(danmaku)}弹幕
https://www.bilibili.com/video/${bvid}`,
      })
    )
    .catch(e => {
      logError(`${global.getTime()} [error] bilibili get video info ${param}`);
      logError(e);
      return {};
    });
};

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
      logError(`${global.getTime()} [error] bilibili get video info ${keyword}`);
      logError(e);
      return {};
    });
