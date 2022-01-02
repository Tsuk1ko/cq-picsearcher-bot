import _ from 'lodash';
import CQ from '../../CQcode';
import emitter from '../../emitter';
import logError from '../../logError';
import { sleep } from '../../utils/sleep';
import { getUserNewDynamicsInfo } from './dynamic';
import { getUserLiveData } from './live';

let pushConfig = { dynamic: {}, live: {} };
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
  if (_.size(pushConfig.dynamic) || _.size(pushConfig.live)) {
    checkPushTask = setInterval(checkPush, Math.max(global.config.bot.bilibili.pushCheckInterval, 30) * 1000);
    checkPush();
  }
}

function getPushConfig() {
  const dynamic = {};
  const live = {};
  _.each(global.config.bot.bilibili.push, (confs, uid) => {
    if (!Array.isArray(confs)) return;
    dynamic[uid] = [];
    live[uid] = [];
    confs.forEach(conf => {
      if (typeof conf === 'number') {
        dynamic[uid].push(conf);
        live[uid].push(conf);
      } else if (typeof conf === 'object' && typeof conf.gid === 'number') {
        if (conf.dynamic === true) dynamic[uid].push(conf.gid);
        if (conf.live === true) live[uid].push(conf.gid);
      }
    });
    if (!dynamic[uid].length) delete dynamic[uid];
    if (!live[uid].length) delete live[uid];
  });
  return { dynamic, live };
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
  for (const [uid, gids] of Object.entries(pushConfig.dynamic)) {
    const dynamics = dynamicMap[uid];
    if (!dynamics || !dynamics.length) continue;
    for (const dynamic of dynamics) {
      for (const gid of gids) {
        tasks.push(() =>
          global.sendGroupMsg(gid, dynamic).catch(e => {
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
  const liveMap = {};
  await Promise.all(
    Object.keys(pushConfig.live).map(async uid => {
      liveMap[uid] = await getUserLiveData(uid);
    })
  );
  const tasks = [];
  for (const [uid, gids] of Object.entries(pushConfig.live)) {
    const liveData = liveMap[uid];
    if (!liveData) continue;
    const { status, name, url, title, cover } = liveData;
    const oldStatus = liveStatusMap.get(uid);
    liveStatusMap.set(uid, status);
    if (status && !oldStatus) {
      for (const gid of gids) {
        tasks.push(() =>
          global.sendGroupMsg(gid, [CQ.img(cover), `【${name}】${title}`, url].join('\n')).catch(e => {
            logError(`${global.getTime()} [error] bilibili push live status to group ${gid}`);
            logError(e);
          })
        );
      }
    }
  }
  return tasks;
}
