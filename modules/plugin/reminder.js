import config from '../config';
import Path from 'path';
import Fse from 'fs-extra';
import Parser from 'cron-parser';
import minimist from 'minimist';
import _ from 'lodash';

const setting = config.picfinder.reminder;

const rmdFile = Path.resolve(__dirname, '../../data/rmd.json');
if (!Fse.existsSync(rmdFile)) Fse.writeJSONSync(rmdFile, { g: {}, d: {}, u: {}, next: 0 });
const rmd = Fse.readJSONSync(rmdFile);
let timeout = {};
let replyFunc = (context, msg, at = false) => {};

function rmdInit(rf) {
    replyFunc = rf;
    restoreRmd();
}

function saveRmd() {
    Fse.writeJSONSync(rmdFile, rmd);
}

function restoreRmd() {
    _.forEach(_.omit(rmd, 'next'), list => {
        _.forEach(list, rlist => {
            _.forEach(rlist, ({ msg, time, ctx }, tid) => {
                const interval = Parser.parseExpression(time);
                start(tid, interval, ctx, msg);
            });
        });
    });
}

function parseArgs(str, enableArray = false) {
    let m = minimist(str.split(' '), {
        boolean: true,
    });
    if (!enableArray) {
        for (let key in m) {
            if (key == '_') continue;
            if (Array.isArray(m[key])) m[key] = m[key][0];
        }
    }
    return m;
}

function start(tid, interval, ctx, msg) {
    const now = _.now();
    let next = 0;
    while (next <= 0) next = interval.next().getTime() - now;

    timeout[tid] = setTimeout(() => {
        replyFunc(ctx, msg);
        start(tid, interval, ctx, msg);
    }, interval.next().getTime() - _.now());
}

function stop(tid) {
    if (timeout[tid]) {
        clearTimeout(timeout[tid]);
        return true;
    } else return false;
}

function addRmd(type, rid, tid, uid, msg, time, ctx) {
    const t = rmd[type];
    if (!t[rid]) t[rid] = {};
    t[rid][tid] = { uid, msg, time, ctx };
    saveRmd();
}

function parseCtx(ctx) {
    let type = '';
    let rid = 0;
    if (ctx.group_id) {
        type = 'g';
        rid = ctx.group_id;
    } else if (ctx.discuss_id) {
        type = 'd';
        rid = ctx.discuss_id;
    } else if (ctx.user_id) {
        type = 'u';
        rid = ctx.user_id;
    }
    return { type, rid };
}

function rmdHandler(ctx) {
    // 限制场景
    if (ctx.user_id != config.picfinder.admin) {
        if (setting.onlyAdmin) {
            return false;
        } else if (setting.onlyPM) {
            if (ctx.group_id || ctx.discuss_id) return false;
        }
    }

    const args = parseArgs(ctx.message);
    if (args.rmd && args.rmd.length > 0) {
        add(ctx, args);
        return true;
    } else if (typeof args['rmd-del'] == 'number') {
        del(ctx, args['rmd-del']);
        return true;
    } else if (args['rmd-list']) {
        list(ctx);
        return true;
    }
    return false;
}

function add(ctx, args) {
    const { type, rid } = parseCtx(ctx);

    if (_.size(rmd[type][rid]) >= 20) {
        replyFunc(ctx, '提醒太多啦，不能再加啦！', true);
        return;
    }

    if (!args.time) {
        replyFunc(ctx, '时间呢？', true);
        return;
    }

    if (args._.length > 0) args.rmd += ' ' + args._.join(' ');

    const rctx = {
        group_id: ctx.group_id,
        discuss_id: ctx.discuss_id,
        user_id: ctx.user_id,
    };
    const cron = args.time.replace(/;/g, ' ');

    const cronParts = cron.split(' ');
    if (cronParts.length < 5) {
        replyFunc(ctx, 'time 格式有误，请使用 crontab 时间格式，并将空格替换成英文分号(;)', true);
        return;
    }
    if (cronParts.length > 5) {
        replyFunc(ctx, '禁止使用秒级 cron 指令', true);
        return;
    }
    const min = cronParts[0].split('/');
    if (min[0] === '*' && (!min[1] || parseInt(min[1]) < 5)) {
        replyFunc(ctx, '提醒间隔需大于 5 分钟', true);
        return;
    }
    if (min[0].split(',').length > 5) {
        replyFunc(ctx, '一个提醒应该用不到这么多分钟级别的逗号吧（', true);
        return;
    }

    try {
        const interval = Parser.parseExpression(cron);
        const tid = rmd.next++;
        addRmd(type, rid, tid, ctx.user_id, args.rmd, cron, rctx);
        start(tid, interval, rctx, args.rmd);
        replyFunc(ctx, `添加成功(ID=${tid})`, true);
    } catch (e) {
        replyFunc(ctx, 'time 格式有误，请使用 crontab 时间格式，并将空格替换成英文分号(;)', true);
    }
}

function list(ctx) {
    const { type, rid } = parseCtx(ctx);
    const list = rmd[type][rid];
    const replys = _.transform(
        list,
        (arr, { uid, msg, time }, tid) => {
            let short = msg
                .replace(/\[CQ:image,[^\]]+\]/g, '[图片]')
                .replace(/\[CQ:at,[^\]]+\]/g, '[@]')
                .replace(/\n/g, ' ');
            if (short.length > 10) short = short.substr(0, 10) + '...';
            arr.push([tid, uid, time, short].join(' | '));
        },
        [['ID', '创建者', 'crontab', '内容'].join(' | ')]
    );
    replyFunc(ctx, replys.join('\n'));
}

function del(ctx, tid) {
    const { type, rid } = parseCtx(ctx);
    try {
        const tlist = rmd[type][rid];
        if (!tlist[tid]) throw new Error();
        delete tlist[tid];
        saveRmd();
        stop(tid);
        replyFunc(ctx, `删除提醒(ID=${tid})成功`);
    } catch (error) {
        replyFunc(ctx, `删除失败，ID不存在或该提醒不属于这里`);
    }
}

export { rmdInit, rmdHandler };
