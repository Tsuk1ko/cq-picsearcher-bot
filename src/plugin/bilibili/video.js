import { get } from 'axios';
import { stringify } from 'qs';
import CQ from '../../CQcode';
import logError from '../../logError';
import humanNum from '../../utils/humanNum';

export const getVideoInfo = param => {
  return get(`https://api.bilibili.com/x/web-interface/view?${stringify(param)}`)
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
      }) => `${CQ.img(pic)}
av${aid}
${title}
UP：${name}
${humanNum(view)}播放 ${humanNum(danmaku)}弹幕
https://www.bilibili.com/video/${bvid}`
    )
    .catch(e => {
      logError(`${global.getTime()} [error] bilibili get video info ${param}`);
      logError(e);
      return null;
    });
};

export const getSearchVideoInfo = keyword =>
  get(`https://api.bilibili.com/x/web-interface/search/all/v2?${stringify({ keyword })}`)
    .then(
      ({
        data: {
          data: { result },
        },
      }) => {
        const videos = result.find(({ result_type: rt }) => rt === 'video').data;
        if (videos.length === 0) return null;
        const { author, aid, bvid, title, pic, play, video_review } = videos[0];
        return `${CQ.img(`http:${pic}`)}
（搜索）av${aid}
${title.replace(/<([^>]+?)[^>]+>(.*?)<\/\1>/g, '$2')}
UP：${author}
${humanNum(play)}播放 ${humanNum(video_review)}弹幕
https://www.bilibili.com/video/${bvid}`;
      }
    )
    .catch(e => {
      logError(`${global.getTime()} [error] bilibili get video info ${keyword}`);
      logError(e);
      return null;
    });
