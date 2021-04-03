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
      }) => { 
        if ( short_id == 0 ) {
          var returnid = room_id
          var sid = ""
        } else {
          var returnid = short_id
          var sid = `短房间号: ${short_id}`
        }
        if ( live_status == 0) {
          var status = "当前主播未开播"
          var popularity = ""
        } else {
          var status = "当前主播正在直播"
          var popularity = `${humanNum(online)}人气`
        }
        return `${CQ.img(keyframe)}
${title}
主播: ${uname}
房间号: ${room_id} ${sid}
${status}
分区: ${parent_area_name}-${area_name} ${popularity}
https://live.bilibili.com/${returnid}`
      })
    .catch(e => {
      logError(`${global.getTime()} [error] bilibili get live room info ${id}`);
      logError(e);
      return null;
    });
