import _ from 'lodash-es';
import CQ from '../../utils/CQcode.mjs';
import humanNum from '../../utils/humanNum.mjs';
import logError from '../../utils/logError.mjs';
import { retryGet, retryPost } from '../../utils/retry.mjs';

export const getLiveRoomInfo = id =>
  retryGet(`https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${id}`, { timeout: 10000 })
    .then(
      ({
        data: {
          data: {
            room_info: { room_id, short_id, title, live_status, area_name, parent_area_name, keyframe, online },
            anchor_info: {
              base_info: { uname },
            },
          },
        },
      }) =>
        [
          CQ.img(keyframe),
          CQ.escape(title),
          `主播：${CQ.escape(uname)}`,
          `房间号：${room_id}${short_id ? `  短号：${short_id}` : ''}`,
          `分区：${parent_area_name}${parent_area_name === area_name ? '' : `-${area_name}`}`,
          live_status ? `直播中  ${humanNum(online)}人气` : '未开播',
          `https://live.bilibili.com/${short_id || room_id}`,
        ].join('\n')
    )
    .catch(e => {
      logError(`[error] bilibili get live room info ${id}`);
      logError(e);
      return null;
    });

/** @deprecated 需要鉴权 */
export const getUserLiveData = async uid => {
  try {
    const {
      data: {
        data: { name, live_room },
      },
    } = await retryGet(`https://api.bilibili.com/x/space/acc/info?mid=${uid}`, { timeout: 10000 });
    if (!live_room) return null;
    const { liveStatus, url, title, cover } = live_room;
    return {
      status: liveStatus,
      name,
      url,
      title,
      cover,
    };
  } catch (e) {
    logError(`[error] bilibili live data ${uid}`);
    logError(e);
    return null;
  }
};

export const getUsersLiveData = async uids => {
  try {
    const {
      data: { data },
    } = await retryPost(
      'https://api.live.bilibili.com/room/v1/Room/get_status_info_by_uids',
      { uids },
      { timeout: 10000 }
    );
    return _.mapValues(data, ({ uname, title, room_id, live_status, cover_from_user }) => ({
      status: live_status,
      name: uname,
      url: `https://live.bilibili.com/${room_id}`,
      title,
      cover: cover_from_user,
    }));
  } catch (e) {
    logError(`[error] bilibili live data ${uids}`);
    logError(e);
    return {};
  }
};
