import { random } from 'lodash';
import Axios from '../axiosProxy';
import config from '../config';
import Pximg from './pximg';
import CQcode from '../CQcode';
import { resolve } from 'url';
import NamedRegExp from 'named-regexp-groups';
import { createCanvas, loadImage } from 'canvas';

const setting = config.picfinder.setu;
const replys = config.picfinder.replys;
const setuReg = new NamedRegExp(config.picfinder.regs.setu);
const proxy = setting.pximgProxy;

if (proxy == '') Pximg.startProxy();

function sendSetu(context, replyFunc, logger, bot) {
    const setuRegExec = setuReg.exec(context.message);
    if (setuRegExec) {
        //普通
        const limit = {
            value: setting.limit,
            cd: setting.cd,
        };
        let delTime = setting.deleteTime;

        const regGroup = setuRegExec.groups || {};
        const r18 = regGroup.r18 && !(context.group_id && setting.r18OnlyInWhite && !setting.whiteGroup.includes(context.group_id));
        const keyword = (regGroup.keyword && `&keyword=${encodeURIComponent(regGroup.keyword)}`) || false;

        //群聊还是私聊
        if (context.group_id) {
            //群白名单
            if (setting.whiteGroup.includes(context.group_id)) {
                limit.cd = setting.whiteCd;
                delTime = setting.whiteDeleteTime;
            } else if (setting.whiteOnly) {
                replyFunc(context, replys.setuReject);
                return true;
            }
        } else {
            if (!setting.allowPM) {
                replyFunc(context, replys.setuReject);
                return true;
            }
            limit.cd = 0; //私聊无cd
        }

        if (!logger.canSearch(context.user_id, limit, 'setu')) {
            replyFunc(context, replys.setuLimit, true);
            return;
        }

        Axios.get(`https://api.lolicon.app/setu/zhuzhu.php?r18=${r18 ? 1 : 0}${keyword ? keyword : ''}${setting.size1200 ? '&size1200' : ''}`)
            .then(ret => ret.data)
            .then(async ret => {
                if (ret.error) {
                    replyFunc(context, ret.error, true);
                    return;
                }
                let url = Pximg.getProxyURL(ret.file);
                if (proxy != '') {
                    let path = /(?<=https:\/\/i.pximg.net\/).+/.exec(url)[0];
                    url = resolve(proxy, path);
                }
                // 反和谐
                let base64 = null;
                if (setting.antiShielding) {
                    await loadImage(url)
                        .then(img => {
                            const { width: w, height: h } = img;
                            const canvas = createCanvas(w, h);
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0);
                            const pixels = [
                                [0, 0, 1, 1],
                                [w - 1, 0, w, 1],
                                [0, h - 1, 1, h],
                                [w - 1, h - 1, w, h],
                            ];
                            for (const pixel of pixels) {
                                ctx.fillStyle = `rgba(${random(255)},${random(255)},${random(255)},0.3)`;
                                ctx.fillRect(...pixel);
                            }
                            base64 = canvas.toDataURL().split(',')[1];
                        })
                        .catch(e => {
                            console.error(`${new Date().toLocaleString()} [error] anti shielding\n${e}`);
                        });
                }
                replyFunc(context, `${ret.url} (p${ret.p})`, true);
                replyFunc(context, base64 ? CQcode.img64(base64) : CQcode.img(url))
                    .then(r => {
                        if (delTime > 0 && r && r.data && r.data.message_id)
                            setTimeout(() => {
                                bot('delete_msg', {
                                    message_id: r.data.message_id,
                                });
                            }, delTime * 1000);
                    })
                    .catch(e => {
                        console.error(`${new Date().toLocaleString()} [error] delete msg\n${e}`);
                    });
                logger.doneSearch(context.user_id, 'setu');
            })
            .catch(e => {
                console.error(`${new Date().toLocaleString()}\n${e}`);
                replyFunc(context, replys.setuError, true);
            });
        return true;
    }
    return false;
}

export default sendSetu;
