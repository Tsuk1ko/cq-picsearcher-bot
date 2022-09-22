import Jimp from 'jimp';
import CQ from '../CQcode';
import logError from '../logError';
import { imgAntiShielding } from './imgAntiShielding';
import { retryAsync } from './retry';

const Axios = require('../axiosProxy');

export const getCqImg64FromUrl = async (url, type = undefined) => {
  try {
    const base64 = await retryAsync(
      () => Axios.getBase64(url),
      3,
      e => e.code === 'ECONNRESET'
    );
    return CQ.img64(base64, type);
  } catch (e) {
    logError(`${global.getTime()} [error] getCqImg64FromUrl`);
    logError(e);
  }
  return '';
};

export const getAntiShieldedCqImg64FromUrl = async (url, mode, type = undefined) => {
  try {
    const arrayBuffer = await retryAsync(
      () => Axios.get(url, { responseType: 'arraybuffer' }).then(r => r.data),
      3,
      e => e.code === 'ECONNRESET'
    );
    const img = await Jimp.read(Buffer.from(arrayBuffer));
    const base64 = await imgAntiShielding(img, mode);
    return CQ.img64(base64, type);
  } catch (e) {
    logError(`${global.getTime()} [error] getAntiShieldedCqImg64FromUrl`);
    logError(e);
  }
  return '';
};
