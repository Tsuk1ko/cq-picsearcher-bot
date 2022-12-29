import dayjs from 'dayjs';
import emitter from '../utils/emitter.mjs';

const cache = new Map();

export default async context => {
  if (context.message_type === 'guild') return false;

  const config = global.config.bot.like;

  const match = new RegExp(config.regexp).exec(context.message);
  if (!match) return false;

  const times = Number(match.groups?.times) || config.defaultTimes;
  const doneTimes = cache.get(context.user_id) || 0;

  if (times < 1) return true;

  if (doneTimes >= config.maxTimes) {
    global.replyMsg(context, '今日点赞次数已满', false, true);
    return true;
  }

  const realTimes = Math.min(times, config.maxTimes - doneTimes);
  if (realTimes < 1) return true;

  try {
    const result = await global.bot('send_like', { user_id: context.user_id, times: realTimes });
    if (result.retcode === 0) {
      cache.set(context.user_id, doneTimes + realTimes);
      global.replyMsg(context, `点赞${realTimes}次成功`, false, true);
    } else {
      console.error('send_like', result);
    }
  } catch (e) {
    console.error('send_like', e);
    global.replyMsg(context, '点赞失败', false, true);
    return true;
  }

  return true;
};

class DailyTask {
  constructor(task) {
    this.timeout = 0;
    this.task = task;
  }

  get nextRunTimeout() {
    return dayjs().add(1, 'd').startOf('d') - dayjs();
  }

  start() {
    if (this.timeout) this.stop();

    this.timeout = setTimeout(() => {
      this.timeout = 0;
      this.start();
      this.task();
    }, this.nextRunTimeout);
  }

  stop() {
    if (!this.timeout) return;

    clearTimeout(this.timeout);
    this.timeout = 0;
  }
}

const dailyLikeTask = new DailyTask(() => {
  cache.clear();

  setTimeout(async () => {
    const uid = global.config.bot.admin;
    const times = global.config.bot.like.adminDailyLike;
    if (uid > 0 && times > 0) {
      try {
        const result = await global.bot('send_like', { user_id: uid, times });
        if (result.retcode === 0) {
          cache.set(global.config.bot.admin, times);
        } else {
          console.error('daily send_like', result);
        }
      } catch (e) {
        console.error('daily send_like', e);
        global.sendMsg2Admin(`每日点赞失败\n${e}`);
      }
    }
  }, 300 * 1000);
});

emitter.onConfigLoad(() => {
  const config = global.config.bot.like;
  if (config.enable) {
    dailyLikeTask.start();
  } else {
    dailyLikeTask.stop();
  }
});
