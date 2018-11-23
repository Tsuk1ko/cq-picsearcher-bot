/*
 * @Author: JindaiKirin 
 * @Date: 2018-07-23 10:54:03 
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2018-11-23 17:27:39
 */
/**
 * 各种记录
 *
 * @class Logger
 */
class Logger {
	constructor() {
		this.searchMode = []; //搜图模式
		this.repeater = []; //复读
		this.searchCount = []; //搜索次数记录
		this.hsaSign = []; //每日签到
		this.date = new Date().getDate();

		this.adminSign = false; //自动帮自己签到

		//每日初始化
		setInterval(() => {
			let nowDate = new Date().getDate();
			if (this.date != nowDate) {
				this.date = nowDate;
				this.searchCount = [];
				this.hsaSign = [];
				this.adminSign = false;
			}
		}, 60 * 1000);
	}

	/**
	 * 管理员是否可以签到（用于自动签到）
	 *
	 * @returns 可以或不可以
	 * @memberof Logger
	 */
	canAdminSign() {
		if (this.adminSign) return false;
		this.adminSign = true;
		return true;
	}

	/**
	 * 搜图模式开关
	 *
	 * @param {number} g 群号
	 * @param {number} u QQ号
	 * @param {boolean} s 开启为true，关闭为false
	 * @returns 已经开启或已经关闭为false，否则为true
	 * @memberof Logger
	 */
	smSwitch(g, u, s) {
		if (!this.searchMode[g]) this.searchMode[g] = [];
		if (!this.searchMode[g][u]) this.searchMode[g][u] = {
			enable: false,
			db: 999
		};
		let t = this.searchMode[g][u];
		if (s) {
			if (t.enable) return false;
			this.searchMode[g][u] = {
				enable: true,
				db: 999
			};
			return true;
		} else {
			if (t.enable) {
				t.enable = false;
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
		this.searchMode[g][u].db = db;
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
		if (!this.searchMode[g] || !this.searchMode[g][u] || !this.searchMode[g][u].enable) return false;
		return this.searchMode[g][u].db;
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
		let t = this.repeater[g];
		//没有记录或另起复读则新建记录
		if (!t || t.msg != msg) {
			this.repeater[g] = {
				user: u,
				msg: msg,
				times: 1,
				done: false
			}
			t = this.repeater[g];
		} else if (t.user != u) {
			//不同人复读则次数加1
			t.user = u;
			t.times++;
		}
		return t.done ? 0 : t.times;
	}

	/**
	 * 标记该群已复读
	 *
	 * @param {number} g 群号
	 * @memberof Logger
	 */
	rptDone(g) {
		this.repeater[g].done = true;
	}

	/**
	 * 记录并判断用户是否可以搜图
	 *
	 * @param {number} u QQ号
	 * @param {*} limit 限制
	 * @returns 允许搜图则返回true，否则返回false
	 * @memberof Logger
	 */
	canSearch(u, limit, key = 'search') {
		if (!this.searchCount[u]) this.searchCount[u] = {};

		if (key == 'setu') {
			if (!this.searchCount[u][key]) this.searchCount[u][key] = {
				date: new Date().getTime() - limit.cd * 1000,
				count: 0
			};
			let setuLog = this.searchCount[u][key];
			if (setuLog.date + limit.cd * 1000 <= new Date().getTime() && limit.value == 0) return true;
			if (setuLog.date + limit.cd * 1000 > new Date().getTime() || setuLog.count++ >= limit.value) return false;
			setuLog.date = new Date().getTime();
			return true;
		}

		if (limit == 0) return true;
		if (!this.searchCount[u][key]) this.searchCount[u][key] = 0;
		if (this.searchCount[u][key]++ < limit) return true;
		return false;
	}

	/**
	 * 用户是否可以签到
	 *
	 * @param {number} u QQ号
	 * @returns 可以则返回true，已经签到过则返回false
	 * @memberof Logger
	 */
	canSign(u) {
		if (this.hsaSign.includes(u)) return false;
		this.hsaSign.push(u);
		return true;
	}
}

export default Logger;
