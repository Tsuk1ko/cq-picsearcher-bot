import config from '../config';
import sqlite from 'sqlite';
import Path from 'path';

const sqlPath = Path.resolve(__dirname, '../../data/db.sqlite');
const expire = config.mysql.expire || 2 * 24 * 3600; //缓存时间

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
 * @class PFSqlite
 */
class PFSqlite {
    /**
     * 连接数据库
     * @memberof PFSqlite
     */
    constructor() {
        this.dbPromise = sqlite.open(sqlPath);
    }

    /**
     * 关闭数据库连接
     *
     * @memberof PFSqlite
     */
    async close() {
        const sqldb = await this.dbPromise;
        return sqldb.close();
    }

    /**
     * 增加或更新缓存记录
     *
     * @param {string} img 图片文件名
     * @param {number} db 搜索库
     * @param {object} msg 消息
     * @returns Promise
     * @memberof PFSqlite
     */
    async addCache(img, db, msg) {
        const sqldb = await this.dbPromise;
        return sqldb.run('REPLACE INTO `cache` (`img`, `db`, `t`, `msg`) VALUES (?, ?, ?, ?)', [img, db, getDateSec(), JSON.stringify(msg)]);
    }

    /**
     * 得到缓存记录
     *
     * @param {string} img 图片文件名
     * @param {number} db 搜索库
     * @returns
     * @memberof PFSqlite
     */
    async getCache(img, db) {
        const sqldb = await this.dbPromise;
        let result = await sqldb.get('SELECT * from `cache` WHERE img=? AND db=?', [img, db]);
        if (result && getDateSec() - result.t < expire) {
            return JSON.parse(result.msg);
        }
        return false;
    }

    /**
     * 数据库建表
     *
     * @static
     * @memberof PFSqlite
     */
    static async sqlInitialize() {
        let test = new PFSqlite();
        const sqldb = await test.dbPromise;
        await sqldb.run('CREATE TABLE IF NOT EXISTS `cache` ( `img` VARCHAR(40) NOT NULL , `db` INT NOT NULL , `t` INT NOT NULL , `msg` TEXT NOT NULL , PRIMARY KEY (`img`, `db`));');
        return test.close();
    }
}

export default PFSqlite;
