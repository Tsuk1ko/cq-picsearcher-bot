/*
 * @Author: JindaiKirin
 * @Date: 2018-07-12 10:23:24
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2018-12-03 16:23:32
 */
//import config from './config';
import sqlite from 'sqlite';
import Path from 'path';

const sqlPath = Path.resolve(__dirname, '../data/db.sqlite');
//let conf = config.mysql;
let expire = 2 * 24 * 3600;
// let expire = conf.expire || 2 * 24 * 3600; //缓存时间
let hasInitialize = false; //是否初始化

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
class Pfsqlite {
    /**
     * 连接数据库
     * @memberof Pfsqlite
     */
    constructor() {
        this.dbPromise = sqlite.open(sqlPath);
        this.dbPromise.then(db => (this.db = db));
    }

    ready() {
        return this.dbPromise;
    }

    /**
     * 关闭数据库连接
     *
     * @memberof Pfsqlite
     */
    async close() {
        this.db.close();
    }

    /**
     * 增加或更新缓存记录
     *
     * @param {string} img 图片文件名
     * @param {number} db 搜索库
     * @param {object} msg 消息
     * @returns Promise
     * @memberof Pfsqlite
     */
    addCache(img, db, msg) {
        return this.db.run('REPLACE INTO `cache` (`img`, `db`, `t`, `msg`) VALUES (?, ?, ?, ?)', [img, db, getDateSec(), JSON.stringify(msg)]);
    }

    /**
     * 得到缓存记录
     *
     * @param {*} img
     * @param {*} db
     * @returns
     * @memberof Pfsqlite
     */
    async getCache(img, db) {
        let result = await this.db.get('SELECT * from `cache` WHERE img=? AND db=?', [img, db]);
        if (result && getDateSec() - result.t < expire) {
            return result;
        }
        return false;
    }

    /**
     * 数据库建表
     *
     * @static
     * @memberof Pfsqlite
     */
    static async sqlInitialize() {
        if (!hasInitialize) {
            let test = new Pfsqlite();
            await test.ready();
            await test.db.run('CREATE TABLE IF NOT EXISTS `cache` ( `img` VARCHAR(40) NOT NULL , `db` INT NOT NULL , `t` INT NOT NULL , `msg` TEXT NOT NULL , PRIMARY KEY (`img`, `db`));');
            test.close();
            hasInitialize = true;
        }
    }
}

export default Pfsqlite;
