import config from '../config';
import co from 'co';
import mysql_co from 'mysql-co';

const conf = config.mysql;
const expire = conf.expire || 2 * 24 * 3600; //缓存时间

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
 * @class PFMysql
 */
class PFMysql {
    /**
     * 连接数据库
     * @memberof PFMysql
     */
    constructor() {
        this.mysql = mysql_co.createConnection({
            host: conf.host,
            port: conf.port || 3306,
            database: conf.db,
            user: conf.user,
            password: conf.password
        });
    }

    /**
     * 关闭数据库连接
     *
     * @memberof PFMysql
     */
    close() {
        return this.mysql.end();
    }

    /**
     * 增加或更新缓存记录
     *
     * @param {string} img 图片文件名
     * @param {number} db 搜索库
     * @param {object} msg 消息
     * @returns Promise
     * @memberof PFMysql
     */
    addCache(img, db, msg) {
        let mysql = this.mysql;
        return co(function*() {
            yield mysql.query('REPLACE INTO `cache` (`img`, `db`, `t`, `msg`) VALUES (?, ?, ?, ?)', [img, db, getDateSec(), JSON.stringify(msg)]);
        });
    }

    /**
     * 得到缓存记录
     *
     * @param {string} img 图片文件名
     * @param {number} db 搜索库
     * @returns
     * @memberof PFMysql
     */
    getCache(img, db) {
        let mysql = this.mysql;
        return co(function*() {
            let que = yield mysql.query('SELECT * from `cache` WHERE img=? AND db=?', [img, db]);
            let rq = que[0];
            if (rq.length > 0 && getDateSec() - rq[0].t < expire) {
                return JSON.parse(rq[0].msg);
            }
            return false;
        });
    }

    /**
     * 数据库建表
     *
     * @static
     * @memberof PFMysql
     */
    static sqlInitialize() {
        let test = new PFMysql();
        return co(function*() {
            yield test.mysql.query('CREATE TABLE IF NOT EXISTS `cache` ( `img` VARCHAR(40) NOT NULL , `db` INT NOT NULL , `t` INT NOT NULL , `msg` TEXT NOT NULL , PRIMARY KEY (`img`, `db`)) ENGINE = InnoDB;');
            test.close();
        });
    }
}

export default PFMysql;
