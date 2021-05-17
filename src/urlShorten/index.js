import oymk from '../urlShorten/oy.mk';
import ywwuy from '../urlShorten/yww.uy';

const SERVER_MAP = {
  'oy.mk': oymk,
  'yww.uy': ywwuy,
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
