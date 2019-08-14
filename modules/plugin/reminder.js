import Path from 'path';
import Fse from 'fs-extra';
import Parser from 'cron-parser';
import minimist from 'minimist';
import _ from 'lodash';

const rmdFile = Path.resolve(__dirname, '../../data/rmd.json');
if (!Fse.existsSync(rmdFile)) Fse.writeJSONSync(rmdFile, { g: {}, d: {}, u: {}, next: 0 });
let rmd = { g: {}, d: {}, u: {}, next: 0 };
// let rmd = Fse.readJSONSync(rmdFile) || { g: {}, d: {}, u: {}, next: 0 };
let timeout = {};
let replyFunc = (context, msg, at = false) => {};

function setReplyFunc(f) {
    replyFunc = f;
}

function parseArgs(str, enableArray = false) {
    let m = minimist(str.split(' '), {
        boolean: true
    });
    if (!enableArray) {
        for (let key in m) {
            if (key == '_') continue;
            if (Array.isArray(m[key])) m[key] = m[key][0];
        }
    }
    return m;
}

function start(id, interval, ctx, msg) {
    timeout[id] = setTimeout(() => {
        replyFunc(ctx, msg);
        start(id, interval, ctx, msg);
    }, interval.next().getTime() - _.now());
}

function add(ctx) {
    let type = '';

    if (ctx.group_id) type = 'g';
    else if (ctx.discuss_id) type = 'd';
    else if (ctx.user_id) type = 'u';

    if (_.size(rmd[type]) >= 20) {
        replyFunc(ctx, '提醒太多啦，不能再加啦！', true);
        return true;
    }

    let args = parseArgs(ctx.message);
    if (!args.rmd || args.rmd.length == 0) return false;
    if (!args.time) {
        replyFunc(ctx, '时间呢？', true);
        return true;
    }

    if (args._.length > 0) args.rmd += ' ' + args._.join(' ');

    let error = false;
    try {
        const interval = parser.parseExpression(args.time.split(',').join(' '));
        start(rmd.next++, interval, ctx, args.rmd);
    } catch (e) {
        error = true;
    }
    if (error) {
        replyFunc(ctx, 'time 格式有误，请使用 crontab 时间格式，并将空格替换成英文逗号(,)', true);
    }
}
