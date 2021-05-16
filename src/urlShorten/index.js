import oymk from '../urlShorten/oy.mk';
import tcn from '../urlShorten/t.cn';
import isgd from '../urlShorten/is.gd';

const SERVER_MAP = {
  'oy.mk': oymk,
  't.cn': tcn,
  'is.gd': isgd,
  none: url => ({
    result: url,
    error: false,
  }),
};

/**
 * @param {keyof SERVER_MAP} server
 * @param {string} url
 * @returns {Promise<{ result: string, error: boolean }>}
 */
export default async (server, url) => {
  const shorten = SERVER_MAP[server] || SERVER_MAP.none;
  return shorten(url);
};
