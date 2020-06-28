import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import config from '../config';
import Path from 'path';

const sqlPath = Path.resolve(__dirname, '../data/db.sqlite');
const expire = config.picfinder.cache.expire || 2 * 24 * 3600; //缓存时间

/**
 * 得到当前时间戳
 *
 * @returns 当前时间戳（秒）
 */
function getDateSec() {
    return Math.floor(Date.now() / 1000);
}

/**
 * 缓存数据库
 *
 * @class PFCache
 */
class PFCache {
    /**
     * 连接数据库
     * @memberof PFCache
     */
    constructor() {
        this.ready = false;
        this.sql = null;
        this.interval = null;
        (async () => {
            this.sql = await open({
                filename: sqlPath,
                driver: sqlite3.Database,
            });
            await this.sql.run('CREATE TABLE IF NOT EXISTS `cache` ( `img` VARCHAR(40) NOT NULL , `db` INT NOT NULL , `t` INT NOT NULL , `msg` TEXT NOT NULL , PRIMARY KEY (`img`, `db`));');
            this.ready = true;
            this.interval = setInterval(() => this.sql.run('DELETE FROM `cache` WHERE `t` <= ?', [getDateSec() - expire]), 3600 * 1000);
        })().catch(e => {
            console.error(`${new Date().toLocaleString()} [error] SQLite`);
            console.error(e);
        });
    }

    /**
     * 关闭数据库连接
     *
     * @memberof PFCache
     */
    close() {
        if (!this.ready) return;
        return this.sql.close();
    }

    /**
     * 增加或更新缓存记录
     *
     * @param {string} img 图片文件名
     * @param {number} db 搜索库
     * @param {object} msg 消息
     * @returns Promise
     * @memberof PFCache
     */
    addCache(img, db, msg) {
        if (!this.ready) return;
        return this.sql.run('REPLACE INTO `cache` (`img`, `db`, `t`, `msg`) VALUES (?, ?, ?, ?)', [img, db, getDateSec(), JSON.stringify(msg)]);
    }

    /**
     * 得到缓存记录
     *
     * @param {string} img 图片文件名
     * @param {number} db 搜索库
     * @returns
     * @memberof PFCache
     */
    async getCache(img, db) {
        if (!this.ready) return;
        const result = await this.sql.get('SELECT * from `cache` WHERE `img` = ? AND `db` = ?', [img, db]);
        if (result && getDateSec() - result.t < expire) {
            return JSON.parse(result.msg);
        }
        return false;
    }
}

export default PFCache;
