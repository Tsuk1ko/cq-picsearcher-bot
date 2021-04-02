import { get } from 'axios';
import CQ from '../../CQcode';
import logError from '../../logError';
import humanNum from '../../utils/humanNum';

export const getLiveRoomInfo = id =>
  get(`https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByRoom?room_id=${id}`)
    .then(
      ({
        data: {
          data: {
            room_info: {
                room_id,
                short_id,
                title,
                live_status,
                area_name,
                parent_area_name,
                keyframe,
                online
             },
            anchor_info: {
                base_info: { uname }
            }
          },
        },
      }) => `${CQ.img(keyframe)}
${title}
主播: ${uname}
房间号: ${room_id} 短房间号: ${short_id}
直播状态为${live_status}
${parent_area_name}-${area_name} ${humanNum(online)}人气
https://live.bilibili.com/${room_id}`
    )
    .catch(e => {
      logError(`${global.getTime()} [error] bilibili get live room info ${id}`);
      logError(e);
      return null;
    });
