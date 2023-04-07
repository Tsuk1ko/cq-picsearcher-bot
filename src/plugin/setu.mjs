import { URL } from 'url';
import Jimp from 'jimp';
import _ from 'lodash-es';
import NamedRegExp from 'named-regexp-groups';
import urlShorten from '../urlShorten/index.mjs';
import Axios from '../utils/axiosProxy.mjs';
import CQ from '../utils/CQcode.mjs';
import { imgAntiShielding } from '../utils/imgAntiShielding.mjs';
import logError from '../utils/logError.mjs';
import logger from '../utils/logger.mjs';
import { getLocalReverseProxyURL } from './pximg.mjs';

const API_URL = 'https://api.lolicon.app/setu/v2';

const PIXIV_404 = Symbol('Pixiv image 404');

async function dlImgAndAntiShielding(url) {
  const setting = global.config.bot.setu;
  const proxy = setting.pximgProxy.trim();
  const img = await Jimp.read(
    proxy ? Buffer.from(await Axios.get(url, { responseType: 'arraybuffer' }).then(r => r.data)) : url
  );
  return await imgAntiShielding(img, global.config.bot.setu.antiShielding);
}

//  酷Q无法以 base64 发送大于 4M 的图片
function checkBase64RealSize(base64) {
  return base64.length && base64.length * 0.75 < 4000000;
}

async function getAntiShieldingBase64(url, fallbackUrl) {
  try {
    const origBase64 = await dlImgAndAntiShielding(url);
    if (checkBase64RealSize(origBase64)) return origBase64;
  } catch (error) {
    // 原图过大
  }
  if (!fallbackUrl) return;
  const m1200Base64 = await dlImgAndAntiShielding(fallbackUrl);
  if (checkBase64RealSize(m1200Base64)) return m1200Base64;
}

function sendSetu(context, reply = true) {
  const setuReg = new NamedRegExp(global.config.bot.regs.setu);
  const setuRegExec = setuReg.exec(CQ.unescape(context.message));
  if (!setuRegExec) return false;

  const setting = global.config.bot.setu;
  const replys = global.config.bot.replys;
  const proxy = setting.pximgProxy.trim();
  const isGroupMsg = context.message_type === 'group';
  const isGuildMsg = context.message_type === 'guild';

  // 普通
  const limit = {
    value: setting.limit,
    cd: setting.cd,
  };
  let delTime = setting.deleteTime;

  const regGroup = setuRegExec.groups || {};
  const r18 =
    regGroup.r18 && // 指令带 r18
    !((isGroupMsg || isGuildMsg) && setting.r18OnlyInWhite && !setting.whiteGroup.has(context.group_id)) && // 白名单 r18
    !(isGuildMsg && !setting.r18AllowInGuild); // 频道 r18
  const keyword = regGroup.keyword ? regGroup.keyword.split('&') : undefined;
  const privateR18 = setting.r18OnlyPrivate && r18 && isGroupMsg;

  // 群聊还是私聊
  if (isGroupMsg) {
    // 群黑名单
    if (setting.blackGroup.has(context.group_id)) {
      global.replyMsg(context, replys.setuReject, false, reply);
      return true;
    }
    // 群白名单
    if (setting.whiteGroup.has(context.group_id)) {
      limit.cd = setting.whiteCd;
      delTime = setting.whiteDeleteTime;
    } else if (setting.whiteOnly) {
      global.replyMsg(context, replys.setuReject, false, reply);
      return true;
    }
  } else {
    // 管理者无限制
    if (context.user_id === global.config.bot.admin) limit.value = 0;
    else if (!setting.allowPM) {
      global.replyMsg(context, replys.setuReject, false, reply);
      return true;
    }
    limit.cd = 0; // 私聊无cd
  }

  if (!logger.applyQuota(context.user_id, limit, 'setu')) {
    global.replyMsg(context, replys.setuLimit, false, reply);
    return true;
  }

  let success = false;
  Axios.post(API_URL, { r18, tag: keyword, size: ['original', 'regular'], proxy: null })
    .then(ret => ret.data)
    .then(async ret => {
      if (ret.error) return global.replyMsg(context, ret.error, false, reply);
      if (!ret.data.length) return global.replyMsg(context, replys.setuNotFind, false, reply);

      const setu = ret.data[0];
      const setuUrl = setting.size1200 ? setu.urls.regular : setu.urls.original;
      const onlySendUrl =
        r18 &&
        setting.r18OnlyUrl[
          context.message_type === 'private' && context.sub_type !== 'friend' ? 'temp' : context.message_type
        ];
      const preSendMsgs = [];

      if (setting.sendUrls || onlySendUrl) {
        preSendMsgs.push(`https://pixiv.net/i/${setu.pid} (p${setu.p})`);
        if (setting.sendPximgProxies.length) {
          const sendUrls = [];
          for (const imgProxy of setting.sendPximgProxies) {
            const imgUrl = getSetuUrlByTemplate(imgProxy, setu, setu.urls.original);
            sendUrls.push((await urlShorten(setting.shortenPximgProxy, imgUrl)).result);
          }
          if (sendUrls.length === 1) preSendMsgs.push(`原图地址：${sendUrls[0]}`);
          else preSendMsgs.push('原图地址：', ...sendUrls);
        }
      }

      if (onlySendUrl) {
        global.replyMsg(context, preSendMsgs.join('\n'), false, reply);
        return;
      }
      if (privateR18) preSendMsgs.push('※ 图片将私聊发送');
      global.replyMsg(context, preSendMsgs.join('\n'), false, reply);

      const getReqUrl = url => (proxy ? getSetuUrlByTemplate(proxy, setu, url) : getLocalReverseProxyURL(url));
      const url = getReqUrl(setuUrl);
      const fallbackUrl = setting.size1200 ? undefined : getReqUrl(setu.urls.regular);

      // 反和谐
      const base64 =
        !privateR18 &&
        isGroupMsg &&
        setting.antiShielding > 0 &&
        (await getAntiShieldingBase64(url, fallbackUrl).catch(e => {
          console.error('[error] anti shielding');
          console.error(url);
          logError(e);
          if (String(e).includes('Could not find MIME for Buffer') || String(e).includes('status code 404')) {
            return PIXIV_404;
          }
          global.replyMsg(context, '反和谐发生错误，图片将原样发送，详情请查看错误日志');
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
          message: CQ.img(url, imgType),
        });
      } else {
        global
          .replyMsg(context, base64 ? CQ.img64(base64, imgType) : CQ.img(url, imgType))
          .then(r => {
            const message_id = _.get(r, 'data.message_id');
            if (delTime > 0 && message_id)
              setTimeout(() => {
                global.bot('delete_msg', { message_id });
              }, delTime * 1000);
          })
          .catch(e => {
            console.error('[error] delete msg');
            logError(e);
          });
      }
      success = true;
    })
    .catch(e => {
      console.error('[error]');
      logError(e);
      global.replyMsg(context, replys.setuError, false, reply);
    })
    .finally(() => {
      if (!success) logger.releaseQuota(context.user_id, 'setu');
    });

  return true;
}

export default sendSetu;

function getSetuUrlByTemplate(tpl, setu, url) {
  const path = new URL(url).pathname.replace(/^\//, '');
  if (!/{{.+}}/.test(tpl)) return new URL(path, tpl).href;
  return _.template(tpl, { interpolate: /{{([\s\S]+?)}}/g })({ path, ..._.pick(setu, ['pid', 'p', 'uid', 'ext']) });
}
