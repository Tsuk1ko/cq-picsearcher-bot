import _ from 'lodash';
import { head } from 'axios';
import NodeCache from 'node-cache';
import CQ from '../../CQcode';
import logError from '../../logError';
import parseJSON from '../../utils/parseJSON';
import { getVideoInfo, getSearchVideoInfo } from './video';
import { getDynamicInfo } from './dynamic';
import { getArticleInfo } from './article';
import { getLiveRoomInfo } from './live';
import { retryAync } from '../../utils/retry';
import './push';

const cache = new NodeCache({ stdTTL: 3 * 60 });

const getIdFromNormalLink = link => {
  if (typeof link !== 'string') return null;
  const searchVideo = /bilibili\.com\/video\/(?:av(\d+)|(bv[\da-z]+))/i.exec(link) || {};
  const searchDynamic = /t\.bilibili\.com\/(\d+)/i.exec(link) || /m\.bilibili\.com\/dynamic\/(\d+)/i.exec(link) || {};
  const searchArticle = /bilibili\.com\/read\/(?:cv|mobile\/)(\d+)/i.exec(link) || {};
  const searchLiveRoom = /live\.bilibili\.com\/(\d+)/i.exec(link) || {};
  return {
    aid: searchVideo[1],
    bvid: searchVideo[2],
    dyid: searchDynamic[1],
    arid: searchArticle[1],
    lrid: searchLiveRoom[1],
  };
};

const getIdFromShortLink = shortLink => {
  return retryAync(
    () =>
      head(shortLink, {
        maxRedirects: 0,
        validateStatus: status => status >= 200 && status < 400,
      }),
    3
  )
    .then(ret => getIdFromNormalLink(ret.headers.location))
    .catch(e => {
      logError(`${global.getTime()} [error] bilibili head short link ${shortLink}`);
      logError(e);
      return {};
    });
};

const getIdFromMsg = async msg => {
  let result = getIdFromNormalLink(msg);
  if (Object.values(result).some(id => id)) return result;
  if ((result = /((b23|acg)\.tv|bili2233.cn)\/[0-9a-zA-Z]+/.exec(msg))) {
    return getIdFromShortLink(`http://${result[0]}`);
  }
  return {};
};

const getCacheKeys = (gid, ids) => ids.filter(id => id).map(id => `${gid}-${id}`);

const markSended = (gid, ...ids) => gid && getCacheKeys(gid, ids).forEach(key => cache.set(key, true));

async function bilibiliHandler(context) {
  const setting = global.config.bot.bilibili;
  const { group_id: gid, message: msg } = context;
  const data = (() => {
    if (msg.includes('com.tencent.miniapp_01') && msg.includes('哔哩哔哩')) {
      if (setting.despise) {
        global.replyMsg(context, CQ.img('https://i.loli.net/2020/04/27/HegAkGhcr6lbPXv.png'));
      }
      return parseJSON(msg);
    }
  })();
  const qqdocurl = _.get(data, 'meta.detail_1.qqdocurl');
  const title = _.get(data, 'meta.detail_1.desc');
  const param = await getIdFromMsg(qqdocurl || msg);
  const { aid, bvid, dyid, arid, lrid } = param;

  if (gid && getCacheKeys(gid, Object.values(param)).some(key => cache.has(key))) return;

  if (setting.getVideoInfo) {
    if (aid || bvid) {
      const { reply, ids } = await getVideoInfo({ aid, bvid });
      if (reply) {
        global.replyMsg(context, reply);
        markSended(gid, ...ids);
      }
      return true;
    }
    if (title && !/bilibili\.com\/bangumi|(b23|acg)\.tv\/(ep|ss)/.test(qqdocurl || msg)) {
      const { reply, ids } = await getSearchVideoInfo(title);
      if (reply) {
        global.replyMsg(context, reply);
        markSended(gid, ...ids);
      }
      return true;
    }
  }

  if (setting.getDynamicInfo && dyid) {
    const reply = await getDynamicInfo(dyid);
    if (reply) {
      global.replyMsg(context, reply);
      markSended(gid, dyid);
    }
    return true;
  }

  if (setting.getArticleInfo && arid) {
    const reply = await getArticleInfo(arid);
    if (reply) {
      global.replyMsg(context, reply);
      markSended(gid, arid);
    }
    return true;
  }

  if (setting.getLiveRoomInfo && lrid) {
    const reply = await getLiveRoomInfo(lrid);
    if (reply) {
      global.replyMsg(context, reply);
      markSended(gid, lrid);
    }
    return true;
  }
}

export default bilibiliHandler;
