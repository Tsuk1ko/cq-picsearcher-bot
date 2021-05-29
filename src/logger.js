import _ from 'lodash';
import Fs from 'fs';
import Path from 'path';
import NodeCache from 'node-cache';
import { checkUpdate } from './utils/checkUpdate';

const banListFile = Path.resolve(__dirname, '../data/ban.json');

if (!Fs.existsSync(banListFile)) {
  Fs.writeFileSync(
    banListFile,
    JSON.stringify({
      u: [],
      g: [],
    })
  );
}

const banList = require(banListFile);
const updateBanListFile = () => Fs.writeFileSync(banListFile, JSON.stringify(banList));

/**
 * 各种记录
 *
 * @class Logger
 */
class Logger {
  constructor() {
    this.searchMode = new NodeCache({ useClones: false, checkperiod: 1 }); // 搜图模式
    this.repeater = new NodeCache({ useClones: false, stdTTL: 86400 }); // 复读
    this.searchCount = new NodeCache({ useClones: false }); // 搜索次数记录
    this.hsaSign = new Set(); // 每日签到
    this.date = new Date().getDate();
    this.dailyJobDone = false; // 每日任务是否完成

    this.searchMode.on('expired', (k, sm) => {
      if (!sm) return;
      if (sm.cb) sm.cb();
      if (sm.enable) sendSmNoImgNotice(sm);
    });

    setInterval(() => {
      // 每日初始化
      const nowDate = new Date().getDate();
      if (this.date !== nowDate) {
        this.date = nowDate;
        this.searchCount.flushAll();
        this.hsaSign.clear();
        this.dailyJobDone = false;
      }
    }, 60000);

    const checkUpdateIntervalHours = Number(global.config.bot.checkUpdate);
    if (checkUpdateIntervalHours > 0) {
      setTimeout(() => {
        checkUpdate().catch(() => {
          console.error(`${global.getTime()} [error] check update`);
        });
      }, 60 * 1000);
      setInterval(() => {
        checkUpdate().catch(() => {
          console.error(`${global.getTime()} [error] check update`);
        });
      }, Math.min(3600000 * checkUpdateIntervalHours, 2 ** 31 - 1));
    }
  }

  ban(type, id) {
    switch (type) {
      case 'u':
        banList.u.push(id);
        break;
      case 'g':
        banList.g.push(id);
        break;
    }
    updateBanListFile();
  }

  checkBan(u, g = 0) {
    if (global.config.bot.ignoreOfficialBot && 2854196300 <= u && u <= 2854216399) return true;
    if (banList.u.includes(u)) return true;
    if (g !== 0 && banList.g.includes(g)) return true;
    return false;
  }

  /**
   * 是否可以执行每日任务
   *
   * @returns 可以或不可以
   * @memberof Logger
   */
  canDoDailyJob() {
    if (this.dailyJobDone) return false;
    this.dailyJobDone = true;
    return true;
  }

  /**
   * 搜图模式开关
   *
   * @param {number} g 群号
   * @param {number} u QQ号
   * @param {boolean} s 开启为true，关闭为false
   * @param {Function} cb 定时关闭搜图模式的回调函数
   * @returns 已经开启或已经关闭为false，否则为true
   * @memberof Logger
   */
  smSwitch(g, u, s, cb = null) {
    const key = `${g}-${u}`;
    const sm = (() => {
      if (!this.searchMode.has(key)) {
        const obj = {
          enable: false,
          db: 999,
          group: g,
          user: u,
          count: 0,
        };
        this.searchMode.set(key, obj);
        return obj;
      }
      return this.searchMode.get(key);
    })();
    sm.cb = cb;
    // 搜图模式切换
    if (s) {
      // 定时关闭搜图模式
      if (g !== 0) this.searchMode.ttl(key, Math.max(global.config.bot.searchModeTimeout, 0));
      if (sm.enable) return false;
      sm.enable = true;
      sm.db = 999;
      return true;
    } else {
      if (sm.enable) {
        sm.enable = false;
        sendSmNoImgNotice(sm);
        sm.count = 0;
        return true;
      }
      return false;
    }
  }

  /**
   * 设置搜图图库
   *
   * @param {number} g 群号
   * @param {number} u QQ号
   * @param {number} db 图库ID
   * @memberof Logger
   */
  smSetDB(g, u, db) {
    const key = `${g}-${u}`;
    if (this.searchMode.has(key)) this.searchMode.get(key).db = db;
  }

  /**
   * 获取搜图模式状态
   *
   * @param {number} g 群号
   * @param {number} u QQ号
   * @returns 未开启返回false，否则返回图库ID
   * @memberof Logger
   */
  smStatus(g, u) {
    const sm = this.searchMode.get(`${g}-${u}`);
    if (!_.get(sm, 'enable')) return false;
    return sm.db;
  }

  /**
   * 搜图模式搜图计数+1
   *
   * @param {number} g 群号
   * @param {number} u QQ号
   * @memberof Logger
   */
  smCount(g, u) {
    const sm = this.searchMode.get(`${g}-${u}`);
    sm.count++;
  }

  /**
   * 记录复读情况
   *
   * @param {number} g 群号
   * @param {number} u QQ号
   * @param {string} msg 消息
   * @returns 如果已经复读则返回0，否则返回当前复读次数
   * @memberof Logger
   */
  rptLog(g, u, msg) {
    let rp = this.repeater.get(g);
    // 没有记录或另起复读则新建记录
    if (!rp || rp.msg !== msg) {
      rp = {
        users: new Set([u]),
        msg: msg,
        done: false,
      };
      this.repeater.set(g, rp);
    } else if (!rp.users.has(u)) {
      // 不同人复读则次数加1
      rp.users.add(u);
    }
    return rp.done ? 0 : rp.users.size;
  }

  /**
   * 标记该群已复读
   *
   * @param {number} g 群号
   * @memberof Logger
   */
  rptDone(g) {
    if (this.repeater.has(g)) this.repeater.get(g).done = true;
  }

  /**
   * 请求配额
   *
   * @param {number} u QQ号
   * @param {*} limit 限制
   * @param {'search' | 'setu'} [key='search']
   * @returns 允许则返回 true，否则返回 false
   * @memberof Logger
   */
  applyQuota(u, limit, key = 'search') {
    const sKey = `${u}-${key}`;
    let sc = this.searchCount.get(sKey);

    const result = (() => {
      switch (key) {
        case 'setu':
          if (!sc) {
            sc = { count: 0, date: 0, _: {} };
            this.searchCount.set(sKey, sc);
          }
          if (sc.date + limit.cd * 1000 <= Date.now() && limit.value === 0) return true;
          if (sc.date + limit.cd * 1000 > Date.now() || sc.count >= limit.value) return false;
          return true;

        default:
          if (!sc) {
            sc = { count: 0 };
            this.searchCount.set(sKey, sc);
          }
          if (limit.value === 0) return true;
          if (sc.count < limit.value) return true;
      }
      return false;
    })();

    if (result) {
      sc.count++;
      if (sc._) sc._ = _.omit(sc, ['count', '_']);
      if (key === 'setu' && limit.cd) sc.date = Date.now();
    }
    return result;
  }

  /**
   * 释放配额
   *
   * @param {number} u QQ号
   * @param {'search' | 'setu'} [key='search']
   * @memberof Logger
   */
  releaseQuota(u, key = 'search') {
    const sKey = `${u}-${key}`;
    const sc = this.searchCount.get(sKey);
    if (!sc) return;

    sc.count = Math.max(0, sc.count - 1);
    if (sc._) Object.assign(sc, sc._);
  }

  /**
   * 用户是否可以签到
   *
   * @param {number} u QQ号
   * @returns 可以则返回true，已经签到过则返回false
   * @memberof Logger
   */
  canSign(u) {
    if (this.hsaSign.has(u)) return false;
    this.hsaSign.add(u);
    return true;
  }
}

export default new Logger();

function sendSmNoImgNotice({ group, user, count }) {
  if (!group || count) return;
  global.replyMsg(
    {
      message_type: 'group',
      group_id: group,
      user_id: user,
    },
    '⚠️未在本次搜图模式中收到过图片',
    true
  );
}
