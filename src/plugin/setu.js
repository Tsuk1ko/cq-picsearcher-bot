import { random } from 'lodash';
import { getProxyURL, getMaster1200 } from './pximg';
import CQcode from '../CQcode';
import { URL } from 'url';
import NamedRegExp from 'named-regexp-groups';
import { createCanvas, loadImage } from 'canvas';
const { get } = require('../axiosProxy');

const zza = Buffer.from('aHR0cHM6Ly9hcGkubG9saWNvbi5hcHAvc2V0dS96aHV6aHUucGhw', 'base64').toString('utf8');

function imgAntiShielding(img) {
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
  return canvas.toDataURL('image/jpeg', 0.97).split(',')[1];
}

function loadImgAndAntiShielding(url) {
  return loadImage(url)
    .then(imgAntiShielding)
    .catch(e => {
      console.error('[error] anti-shielding load image');
      console.error(e);
      return '';
    });
}

//  酷Q无法以 base64 发送大于 4M 的图片
function checkBase64RealSize(base64) {
  return base64.length && base64.length * 0.75 < 4000000;
}

async function getAntiShieldingBase64(url) {
  const setting = global.config.bot.setu;
  if (setting.antiShielding) {
    const origBase64 = await loadImgAndAntiShielding(url);
    if (checkBase64RealSize(origBase64)) return origBase64;
    if (setting.size1200) return false;
    const m1200Base64 = await loadImgAndAntiShielding(getMaster1200(url));
    if (checkBase64RealSize(m1200Base64)) return m1200Base64;
  }
  return false;
}

function sendSetu(context, replyFunc, logger, bot) {
  const setting = global.config.bot.setu;
  const replys = global.config.bot.replys;
  const proxy = setting.pximgProxy.trim();
  const setuReg = new NamedRegExp(global.config.bot.regs.setu);
  const setuRegExec = setuReg.exec(context.message);
  if (setuRegExec) {
    // 普通
    const limit = {
      value: setting.limit,
      cd: setting.cd,
    };
    let delTime = setting.deleteTime;

    const regGroup = setuRegExec.groups || {};
    const r18 =
      regGroup.r18 && !(context.group_id && setting.r18OnlyInWhite && !setting.whiteGroup.includes(context.group_id));
    const keyword = (regGroup.keyword && `&keyword=${encodeURIComponent(regGroup.keyword)}`) || false;

    // 群聊还是私聊
    if (context.group_id) {
      // 群白名单
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
      limit.cd = 0; // 私聊无cd
    }

    if (!logger.canSearch(context.user_id, limit, 'setu')) {
      replyFunc(context, replys.setuLimit, true);
      return true;
    }

    get(
      `${zza}?r18=${r18 ? 1 : 0}${keyword || ''}${setting.size1200 ? '&size1200' : ''}${
        setting.apikey ? '&apikey=' + setting.apikey.trim() : ''
      }`
    )
      .then(ret => ret.data)
      .then(async ret => {
        if (ret.code !== 0) {
          if (ret.code === 429) replyFunc(context, replys.setuQuotaExceeded || ret.error, true);
          else replyFunc(context, ret.error, true);
          return;
        }

        replyFunc(context, `${ret.url} (p${ret.p})`, true);

        const url =
          proxy === ''
            ? getProxyURL(ret.file)
            : new URL(/(?<=https:\/\/i.pximg.net\/).+/.exec(ret.file)[0], proxy).toString();

        // 反和谐
        const base64 = await getAntiShieldingBase64(url).catch(e => {
          console.error(`${new Date().toLocaleString()} [error] anti shielding\n${url}\n${e}`);
          replyFunc(context, '反和谐发生错误，详情请查看错误日志', true);
          return false;
        });

        replyFunc(context, base64 ? CQcode.img64(base64) : CQcode.img(url))
          .then(r => {
            console.log('send', r.data);
            if (delTime > 0 && r && r.data && r.data.message_id)
              setTimeout(() => {
                bot('delete_msg', { message_id: r.data.message_id }).then(r => console.log('delete', r));
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
