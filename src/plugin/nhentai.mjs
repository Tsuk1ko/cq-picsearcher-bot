import NHentaiApi from 'nhentai-api';
import Axios from '../utils/axiosProxy.mjs';

const nhentai = new NHentaiApi();

const getSearchURL = keyword => encodeURI(nhentai.search(keyword));

/**
 * nhentai搜索
 *
 * @param {string} name 本子名
 * @returns 本子信息
 */
async function doSearch(name) {
  const get = global.config.bot.nHentaiUsePuppeteer ? getNHentaiWithPuppeteer : Axios.get;
  let json = await get(getSearchURL(`${name} chinese`)).then(r => r.data);
  if (json.result.length === 0) json = await get(getSearchURL(name)).then(r => r.data);
  if (json.result.length === 0) return false;
  return json.result[0];
}

async function getNHentaiWithPuppeteer(url) {
  const { puppeteer } = await import('../../libs/puppeteer/index.mjs');
  return await puppeteer.getJSON(url);
}

export default doSearch;
