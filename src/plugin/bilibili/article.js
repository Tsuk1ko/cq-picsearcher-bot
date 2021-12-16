import CQ from '../../CQcode';
import logError from '../../logError';
import humanNum from '../../utils/humanNum';
import { retryGet } from '../../utils/retry';

export const getArticleInfo = id =>
  retryGet(`https://api.bilibili.com/x/article/viewinfo?id=${id}`, { timeout: 10000 })
    .then(
      ({
        data: {
          data: {
            stats: { view, reply },
            title,
            author_name,
            origin_image_urls: [img],
          },
        },
      }) => `${CQ.img(img)}
${title}
UP：${author_name}
${humanNum(view)}阅读 ${humanNum(reply)}评论
https://www.bilibili.com/read/cv${id}`
    )
    .catch(e => {
      logError(`${global.getTime()} [error] bilibili get article info ${id}`);
      logError(e);
      return null;
    });
