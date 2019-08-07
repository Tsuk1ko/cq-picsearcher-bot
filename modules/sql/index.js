import PFMysql from './pfmysql';
import PFSqlite from './pfsqlite';
import config from '../config';

export default (config.mysql.sqlite ? PFSqlite : PFMysql);
