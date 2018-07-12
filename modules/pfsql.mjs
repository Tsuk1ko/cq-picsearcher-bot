/*
 * @Author: JindaiKirin 
 * @Date: 2018-07-12 10:23:24 
 * @Last Modified by: JindaiKirin
 * @Last Modified time: 2018-07-12 21:50:34
 */
import config from '../config.json';
import co from 'co';
import mysql_co from 'mysql-co';


var conf = config.mysql;
var hasInitialize = false;
var isEnable = (config.mysql && config.mysql.enable) || false;


/**
 * 得到当前时间戳
 *
 * @returns 当前时间戳（秒）
 */
function getDateSec() {
	return Math.floor(Date.now() / 1000);
}


/**
 * Picfinder数据库
 *
 * @class Pfsql
 */
class Pfsql {
	/**
	 * 连接数据库
	 * @memberof Pfsql
	 */
	constructor() {
		this.mysql = mysql_co.createConnection({
			host: conf.host,
			database: conf.db,
			user: conf.user,
			password: conf.password
		});
	}


	/**
	 * 关闭数据库连接
	 * 
	 * @memberof Pfsql
	 */
	close() {
		this.mysql.end();
	}


	/**
	 * 增加或更新缓存记录
	 *
	 * @param {string} img 图片文件名
	 * @param {number} db 搜索库
	 * @param {object} msg 消息
	 * @returns Promise
	 * @memberof Pfsql
	 */
	addCache(img, db, msg) {
		var mysql = this.mysql;
		return co(function* () {
			yield mysql.query('REPLACE INTO `cache` (`img`, `db`, `t`, `msg`) VALUES (?, ?, ?, ?)', [img, db, getDateSec(), JSON.stringify(msg)]);
		});
	}


	/**
	 * 得到缓存记录
	 *
	 * @param {*} img
	 * @param {*} db
	 * @returns
	 * @memberof Pfsql
	 */
	getCache(img, db) {
		var mysql = this.mysql;
		return co(function* () {
			var que = yield mysql.query('SELECT * from `cache` WHERE img=? AND db=?', [img, db]);
			var rq = que[0];
			if (rq.length > 0 && (getDateSec() - rq[0].t) < 2 * 24 * 3600) {
				return JSON.parse(rq[0].msg);
			}
			return false;
		});
	}


	/**
	 * 数据库建表
	 *
	 * @static
	 * @memberof Pfsql
	 */
	static async sqlInitialize() {
		if (isEnable && !hasInitialize) {
			var test = new Pfsql();
			await co(function* () {
				yield test.mysql.query('CREATE TABLE IF NOT EXISTS `cache` ( `img` VARCHAR(40) NOT NULL , `db` INT NOT NULL , `t` INT NOT NULL , `msg` TEXT NOT NULL , PRIMARY KEY (`img`, `db`)) ENGINE = InnoDB;');
				test.close();
			});
			hasInitialize = true;
		}
	}

	/**
	 * 是否启用数据库
	 *
	 * @static
	 * @returns Boolean
	 * @memberof Pfsql
	 */
	static isEnable() {
		return isEnable && hasInitialize;
	}
}


export default Pfsql;
