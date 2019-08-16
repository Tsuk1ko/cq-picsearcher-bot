import Axios from 'axios';
import config from '../config';
import Pximg from './pximg';
import CQcode from '../CQcode';
import { resolve } from 'url';

const setting = config.picfinder.setu;
const setuReply = config.picfinder.replys;
const setuReg = new RegExp(config.picfinder.regs.setu);
const proxy = setting.pximgProxy;

if (proxy == '') Pximg.startProxy();

function sendSetu(context, replyFunc, logger, bot) {
    if (setuReg.exec(context.message)) {
        //普通
        let limit = {
            value: setting.limit,
            cd: setting.cd,
        };
        let delTime = setting.deleteTime;

        //群聊还是私聊
        if (context.group_id) {
            //群白名单
            if (setting.whiteGroup.includes(context.group_id)) {
                limit.cd = setting.whiteCd;
                delTime = setting.whiteDeleteTime;
            } else if (setting.whiteOnly) {
                replyFunc(context, setuReply.setuReject);
                return true;
            }
        } else {
            if (!setting.allowPM) {
                replyFunc(context, setuReply.setuReject);
                return true;
            }
            limit.cd = 0; //私聊无cd
        }

        if (!logger.canSearch(context.user_id, limit, 'setu')) {
            replyFunc(context, setuReply.setuLimit, true);
            return;
        }

        Axios.get('https://api.lolicon.app/setu/zhuzhu.php')
            .then(ret => ret.data)
            .then(ret => {
                let url = Pximg.getProxyURL(ret.file);
                if (proxy != '') {
                    let path = /(?<=https:\/\/i.pximg.net\/).+/.exec(url)[0];
                    url = resolve(proxy, path);
                }
                replyFunc(context, `${ret.url} (p${ret.p})`, true);
                replyFunc(context, CQcode.img(url))
                    .then(r => {
                        if (delTime > 0)
                            setTimeout(() => {
                                if (r && r.data && r.data.message_id)
                                    bot('delete_msg', {
                                        message_id: r.data.message_id,
                                    });
                            }, delTime * 1000);
                    })
                    .catch(e => {
                        console.log(`${new Date().toLocaleString()} [error] delete msg\n${e}`);
                    });
            })
            .catch(e => {
                console.error(`${new Date().toLocaleString()}\n${e}`);
                replyFunc(context, setuReply.setuError);
            });
        return true;
    }
    return false;
}

export default sendSetu;
