import NodeCache from 'node-cache';
import CQ from '../../CQcode';
import logError from '../../logError';
import humanNum from '../../utils/humanNum';
import { retryGet } from '../../utils/retry';

const CACHE_MIN_TTL = 3600;
const firstSendingFlagCache = new NodeCache({ useClones: false });
const sendedVideoIdCache = new NodeCache({ useClones: false });

export const getUserSeasonNewVideosInfo = async usid => {
  try {
    const [uid, sid] = usid.split(':');
    const { data } = await retryGet(
      `https://api.bilibili.com/x/polymer/space/seasons_archives_list?mid=${uid}&season_id=${sid}&sort_reverse=false&page_num=1&page_size=10`,
      { timeout: 10000 }
    );
    const { aids, archives, meta } = data.data;

    // 拉到的有问题
    if (!aids.length || !archives.length) {
      logError(`${global.getTime()} [error] bilibili get user season new videos info ${usid}: no videos`);
      logError(JSON.stringify(data));
      return null;
    }

    // 拉到的存起来
    const { pushCheckInterval } = global.config.bot.bilibili;
    const ttl = Math.max(CACHE_MIN_TTL, pushCheckInterval * 10);
    const newAids = new Set(aids.filter(aid => !sendedVideoIdCache.get(aid)));
    aids.forEach(aid => sendedVideoIdCache.set(aid, true, ttl));

    // 是首次拉取则不发送
    const isFirstSending = !firstSendingFlagCache.get(usid);
    firstSendingFlagCache.set(usid, true, ttl);
    if (isFirstSending) return;

    // 发
    return archives.filter(({ aid }) => newAids.has(aid)).map(video => formatSeasonVideo(video, meta));
  } catch (e) {
    logError(`${global.getTime()} [error] bilibili get user season new videos info ${usid}`);
    logError(e);
    return null;
  }
};

const formatSeasonVideo = ({ aid, bvid, pic, stat: { view }, title }, { name }) => `${CQ.img(pic)}
av${aid}
${CQ.escape(title)}
合集：${CQ.escape(name)}
${humanNum(view)}播放
https://www.bilibili.com/video/${bvid}`;
