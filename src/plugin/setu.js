import _, { random } from 'lodash';
import { getProxyURL, getMaster1200 } from './pximg';
import CQcode from '../CQcode';
import { URL } from 'url';
import NamedRegExp from 'named-regexp-groups';
import '../utils/jimp.plugin';
import Jimp from 'jimp';
import urlShorten from '../urlShorten';
import logger from '../logger';
const Axios = require('../axiosProxy');

const zza = Buffer.from('aHR0cHM6Ly9hcGkubG9saWNvbi5hcHAvc2V0dS96aHV6aHUucGhw', 'base64').toString('utf8');

const PIXIV_404 = Symbol('Pixiv image 404');

async function imgAntiShielding(url) {
  const img = await Jimp.read(url);

  switch (Number(global.config.bot.setu.antiShielding)) {
    case 1:
      const [w, h] = [img.getWidth(), img.getHeight()];
      const pixels = [
        [0, 0],
        [w - 1, 0],
        [0, h - 1],
        [w - 1, h - 1],
      ];
      for (const [x, y] of pixels) {
        img.setPixelColor(Jimp.rgbaToInt(random(255), random(255), random(255), 1), x, y);
      }
      break;

    case 2:
      img.simpleRotate(90);
      break;
  }

  return (await img.getBase64Async(Jimp.AUTO)).split(',')[1];
}

//  酷Q无法以 base64 发送大于 4M 的图片
function checkBase64RealSize(base64) {
  return base64.length && base64.length * 0.75 < 4000000;
}

async function getAntiShieldingBase64(url) {
  const setting = global.config.bot.setu;
  if (setting.antiShielding) {
    try {
      const origBase64 = await imgAntiShielding(url);
      if (checkBase64RealSize(origBase64)) return origBase64;
    } catch (error) {
      // 原图过大
    }
    if (setting.size1200) return false;
    const m1200Base64 = await imgAntiShielding(getMaster1200(url));
    if (checkBase64RealSize(m1200Base64)) return m1200Base64;
  }
  return false;
}

function sendSetu(context, at = true) {
  const setting = global.config.bot.setu;
  const replys = global.config.bot.replys;
  const proxy = setting.pximgProxy.trim();
  const setuReg = new NamedRegExp(global.config.bot.regs.setu);
  const setuRegExec = setuReg.exec(context.message);
  const isGroupMsg = context.message_type === 'group';
  if (setuRegExec) {
    // 普通
    const limit = {
      value: setting.limit,
      cd: setting.cd,
    };
    let delTime = setting.deleteTime;

    const regGroup = setuRegExec.groups || {};
    const r18 =
      regGroup.r18 && !(isGroupMsg && setting.r18OnlyInWhite && !setting.whiteGroup.includes(context.group_id));
    const keyword = (regGroup.keyword && `&keyword=${encodeURIComponent(regGroup.keyword)}`) || false;
    const privateR18 = setting.r18OnlyPrivate && r18 && isGroupMsg;

    // 群聊还是私聊
    if (isGroupMsg) {
      // 群白名单
      if (setting.whiteGroup.includes(context.group_id)) {
        limit.cd = setting.whiteCd;
        delTime = setting.whiteDeleteTime;
      } else if (setting.whiteOnly) {
        global.replyMsg(context, replys.setuReject);
        return true;
      }
    } else {
      if (!setting.allowPM) {
        global.replyMsg(context, replys.setuReject);
        return true;
      }
      limit.cd = 0; // 私聊无cd
    }

    if (!logger.canSearch(context.user_id, limit, 'setu')) {
      global.replyMsg(context, replys.setuLimit, at);
      return true;
    }

    Axios.get(
      `${zza}?r18=${r18 ? 1 : 0}${keyword || ''}${setting.size1200 ? '&size1200' : ''}${
        setting.apikey ? '&apikey=' + setting.apikey.trim() : ''
      }`
    )
      .then(ret => ret.data)
      .then(async ret => {
        if (ret.code !== 0) {
          if (ret.code === 429) global.replyMsg(context, replys.setuQuotaExceeded || ret.error, true);
          else global.replyMsg(context, ret.error, at);
          return;
        }

        const urlMsgs = [`${ret.url} (p${ret.p})`];
        if (setting.sendPximgProxys.length) {
          urlMsgs.push('原图镜像地址：');
          for (const imgProxy of setting.sendPximgProxys) {
            const imgUrl = getSetuUrlByTemplate(imgProxy, ret);
            urlMsgs.push((await urlShorten(setting.shortenPximgProxy, imgUrl)).result);
          }
        }

        if (
          r18 &&
          setting.r18OnlyUrl[
            context.message_type === 'private' && context.sub_type !== 'friend' ? 'temp' : context.message_type
          ]
        ) {
          global.replyMsg(context, urlMsgs.join('\n'), false, at);
          return;
        }
        if (privateR18) urlMsgs.push('※ 图片将私聊发送');
        global.replyMsg(context, urlMsgs.join('\n'), at);

        const url = proxy === '' ? getProxyURL(ret.file) : getSetuUrlByTemplate(proxy, ret);

        // 反和谐
        const base64 =
          !privateR18 &&
          isGroupMsg &&
          (await getAntiShieldingBase64(url).catch(e => {
            console.error(`${global.getTime()} [error] anti shielding`);
            console.error(ret.file);
            console.error(e);
            if (String(e).includes('Could not find MIME for Buffer')) return PIXIV_404;
            global.replyMsg(context, '反和谐发生错误，图片将原样发送，详情请查看错误日志');
            return false;
          }));

        if (base64 === PIXIV_404) {
          global.replyMsg(context, '图片发送失败，可能是网络问题/插画已被删除/原图地址失效');
          return;
        }

        const imgType = delTime === -1 ? 'flash' : null;
        if (privateR18) {
          global.bot('send_private_msg', {
            user_id: context.user_id,
            group_id: setting.r18OnlyPrivateAllowTemp ? context.group_id : undefined,
            message: base64 ? CQcode.img64(base64, imgType) : CQcode.img(url, imgType),
          });
        } else {
          global
            .replyMsg(context, base64 ? CQcode.img64(base64, imgType) : CQcode.img(url, imgType))
            .then(r => {
              const message_id = _.get(r, 'data.message_id');
              if (delTime > 0 && message_id)
                setTimeout(() => {
                  global.bot('delete_msg', { message_id });
                }, delTime * 1000);
            })
            .catch(e => {
              console.error(`${global.getTime()} [error] delete msg`);
              console.error(e);
            });
        }
        logger.doneSearch(context.user_id, 'setu');
      })
      .catch(e => {
        console.error(`${global.getTime()} [error]`);
        console.error(e);
        global.replyMsg(context, replys.setuError, at);
      });
    return true;
  }
  return false;
}

export default sendSetu;

function getSetuUrlByTemplate(tpl, setu) {
  const path = new URL(setu.file).pathname;
  if (!/{{.+}}/.test(tpl)) return new URL(`.${path}`, tpl).href;
  return _.template(tpl, { interpolate: /{{([\s\S]+?)}}/g })({ path, ..._.pick(setu, ['pid', 'p']) });
}
