import CQ from '../../utils/CQcode.mjs';
import humanNum from '../../utils/humanNum.mjs';
import logError from '../../utils/logError.mjs';
import { retryGet } from '../../utils/retry.mjs';

export const getArticleInfo = async id => {
  try {
    const { cookie } = global.config.bot.bilibili;

    const {
      data: {
        data: {
          stats: { view, reply },
          title,
          author_name,
          origin_image_urls: [img],
        },
      },
    } = await retryGet(`https://api.bilibili.com/x/article/viewinfo?id=${id}`, {
      timeout: 10000,
      headers: cookie ? { Cookie: cookie } : {},
    });

    return `${CQ.img(img)}
${CQ.escape(title)}
UP：${CQ.escape(author_name)}
${humanNum(view)}阅读 ${humanNum(reply)}评论
https://www.bilibili.com/read/cv${id}`;
  } catch (e) {
    logError(`[error] bilibili get article info ${id}`);
    logError(e);
    return null;
  }
};
