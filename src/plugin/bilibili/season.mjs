import _ from 'lodash-es';
import NodeCache from 'node-cache';
import CQ from '../../utils/CQcode.mjs';
import logError from '../../utils/logError.mjs';
import { retryGet } from '../../utils/retry.mjs';

const CACHE_MIN_TTL = 3600;
const firstSendingFlagCache = new NodeCache({ useClones: false });
const sendedVideoIdCache = new NodeCache({ useClones: false });

/**
 * @param {string} usid
 * @param {'season' | 'series'} type
 */
export const getUserSeasonNewVideosInfo = async (usid, type) => {
  try {
    const [uid, sid] = usid.split(':');
    const { data } = await retryGet(
      type === 'season'
        ? `https://api.bilibili.com/x/polymer/space/seasons_archives_list?mid=${uid}&season_id=${sid}&sort_reverse=false&page_num=1&page_size=10`
        : `https://api.bilibili.com/x/series/archives?mid=${uid}&series_id=${sid}&only_normal=true&sort=desc&pn=1&ps=10`,
      { timeout: 10000 }
    );

    if (data.code !== 0) {
      if (type === 'season' && data.code === -404) {
        logError(
          `[error] 获取不到视频合集信息，请检查 uid=${uid} sid=${sid} 是否是视频列表而不是视频合集`
        );
        return;
      }
      logError(`[error] bilibili get ${type} (${data.code})`, data.message);
      return;
    }

    const { aids, archives } = data.data;
    let { meta } = data.data;

    // 拉到的有问题
    if (!(aids && aids.length) || !(archives && archives.length)) {
      if (type === 'series') {
        logError(
          `[error] 获取不到视频列表信息，请检查 uid=${uid} sid=${sid} 是否是视频合集而不是视频列表`
        );
      }
      return;
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

    if (type === 'series' && !(meta && meta.name)) {
      const ret = await retryGet(`https://api.bilibili.com/x/series/series?series_id=${sid}`, { timeout: 10000 });
      meta = _.get(ret, 'data.data.meta');
    }

    // 发
    return archives.filter(({ aid }) => newAids.has(aid)).map(video => formatSeasonVideo(video, meta));
  } catch (e) {
    logError(`[error] bilibili get user season new videos info ${usid}`);
    logError(e);
  }
};

const formatSeasonVideo = ({ aid, bvid, pic, stat: { view }, title }, { name } = {}) => `${CQ.img(pic)}
av${aid}
${CQ.escape(title)}
合集：${CQ.escape(name)}
https://www.bilibili.com/video/${bvid}`;
