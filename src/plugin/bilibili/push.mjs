import _ from 'lodash-es';
import CQ from '../../utils/CQcode.mjs';
import emitter from '../../utils/emitter.mjs';
import logError from '../../utils/logError.mjs';
import { sleep } from '../../utils/sleep.mjs';
import { getUserNewDynamicsInfo } from './dynamic.mjs';
import { getUsersLiveData } from './live.mjs';
import { getUserSeasonNewVideosInfo } from './season.mjs';
import { purgeLink } from './utils.mjs';

let pushConfig = { dynamic: {}, live: {}, season: {}, series: {} };
const liveStatusMap = new Map();
let checkPushTask = null;

emitter.onConfigLoad(init);

function init() {
  if (checkPushTask) {
    clearInterval(checkPushTask);
    checkPushTask = null;
  }
  pushConfig = getPushConfig();
  for (const uid of liveStatusMap.keys()) {
    if (!(uid in pushConfig.live)) liveStatusMap.delete(uid);
  }
  if (_.size(pushConfig.dynamic) || _.size(pushConfig.live) || _.size(pushConfig.season)) {
    checkPushTask = setInterval(checkPush, Math.max(global.config.bot.bilibili.pushCheckInterval, 30) * 1000);
    checkPush();
  }
}

function getPushConfig() {
  const dynamic = {};
  const live = {};
  const season = {};
  const series = {};
  _.each(global.config.bot.bilibili.push, (confs, uid) => {
    if (!Array.isArray(confs)) return;
    dynamic[uid] = [];
    live[uid] = [];
    confs.forEach(conf => {
      if (typeof conf === 'number') {
        dynamic[uid].push({ gid: conf });
        live[uid].push({ gid: conf });
      } else if (typeof conf === 'object' && typeof conf.gid === 'number') {
        if (conf.dynamic === true) dynamic[uid].push({ gid: conf.gid, atAll: conf.dynamicAtAll });
        else if (conf.video === true) dynamic[uid].push({ gid: conf.gid, atAll: conf.dynamicAtAll, onlyVideo: true });
        if (conf.live === true) live[uid].push({ gid: conf.gid, atAll: conf.liveAtAll });
        if (conf.seasons && conf.seasons.length) {
          conf.seasons.forEach(sid => {
            const key = `${uid}:${sid}`;
            if (!season[key]) season[key] = [];
            season[key].push({ gid: conf.gid, atAll: conf.seasonAtAll });
          });
        }
        if (conf.series && conf.series.length) {
          conf.series.forEach(sid => {
            const key = `${uid}:${sid}`;
            if (!series[key]) series[key] = [];
            series[key].push({ gid: conf.gid, atAll: conf.seriesAtAll });
          });
        }
      }
    });
    if (!dynamic[uid].length) delete dynamic[uid];
    if (!live[uid].length) delete live[uid];
  });
  return { dynamic, live, season, series };
}

async function checkPush() {
  const tasks = _.flatten(
    await Promise.all([
      checkDynamic().catch(e => {
        logError(`${global.getTime()} [error] bilibili check dynamic`);
        logError(e);
        return [];
      }),
      checkLive().catch(e => {
        logError(`${global.getTime()} [error] bilibili check live`);
        logError(e);
        return [];
      }),
      checkSeason('season').catch(e => {
        logError(`${global.getTime()} [error] bilibili check season`);
        logError(e);
        return [];
      }),
      checkSeason('series').catch(e => {
        logError(`${global.getTime()} [error] bilibili check series`);
        logError(e);
        return [];
      }),
    ])
  );
  for (const task of tasks) {
    await task();
    await sleep(1000);
  }
}

async function checkDynamic() {
  const dynamicMap = {};
  await Promise.all(
    Object.keys(pushConfig.dynamic).map(async uid => {
      dynamicMap[uid] = await getUserNewDynamicsInfo(uid);
    })
  );
  const tasks = [];
  for (const [uid, confs] of Object.entries(pushConfig.dynamic)) {
    const dynamics = dynamicMap[uid];
    if (!dynamics || !dynamics.length) continue;
    for (const { type, text } of dynamics) {
      for (const { gid, atAll, onlyVideo } of confs) {
        if (onlyVideo && type !== 8) continue;
        tasks.push(() =>
          global.sendGroupMsg(gid, atAll ? `${text}\n\n${CQ.atAll()}` : text).catch(e => {
            logError(`${global.getTime()} [error] bilibili push dynamic to group ${gid}`);
            logError(e);
          })
        );
      }
    }
  }
  return tasks;
}

async function checkLive() {
  const liveMap = await getUsersLiveData(Object.keys(pushConfig.live));
  const tasks = [];
  for (const [uid, confs] of Object.entries(pushConfig.live)) {
    const liveData = liveMap[uid];
    if (!liveData) continue;
    const { status, name, url, title, cover } = liveData;
    const oldStatus = liveStatusMap.get(uid);
    liveStatusMap.set(uid, status);
    if (status === 1 && status !== oldStatus) {
      for (const { gid, atAll } of confs) {
        tasks.push(() =>
          global
            .sendGroupMsg(
              gid,
              [CQ.img(cover), `【${name}】${title}`, purgeLink(url), ...(atAll ? [CQ.atAll()] : [])].join('\n')
            )
            .catch(e => {
              logError(`${global.getTime()} [error] bilibili push live status to group ${gid}`);
              logError(e);
            })
        );
      }
    }
  }
  return tasks;
}

/**
 * @param {'season' | 'series'} type
 */
async function checkSeason(type) {
  const map = {};
  await Promise.all(
    Object.keys(pushConfig[type]).map(async usid => {
      map[usid] = await getUserSeasonNewVideosInfo(usid, type);
    })
  );
  const tasks = [];
  for (const [usid, confs] of Object.entries(pushConfig[type])) {
    const texts = map[usid];
    if (!texts || !texts.length) continue;
    for (const text of texts) {
      for (const { gid, atAll } of confs) {
        tasks.push(() =>
          global.sendGroupMsg(gid, atAll ? `${text}\n\n${CQ.atAll()}` : text).catch(e => {
            logError(`${global.getTime()} [error] bilibili push ${type} video to group ${gid}`);
            logError(e);
          })
        );
      }
    }
  }
  return tasks;
}
