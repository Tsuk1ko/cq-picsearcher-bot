import CQ from '../CQcode';
import logError from '../logError';
import { retryAync } from './retry';

const Axios = require('../axiosProxy');

export const getCqImg64FromUrl = async (url, type = null) => {
  try {
    const base64 = await retryAync(
      () => Axios.getBase64(url, type),
      3,
      e => e.code === 'ECONNRESET'
    );
    return CQ.img64(base64);
  } catch (e) {
    logError(`${global.getTime()} [error] getCqImg64FromUrl`);
    logError(e);
  }
  return '';
};
