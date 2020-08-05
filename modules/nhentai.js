import NHentaiApi from 'nhentai-api';
import { get } from './axiosProxy';

const nhentai = new NHentaiApi();

const getSearchURL = keyword => encodeURI(nhentai.search(keyword));

/**
 * nhentai搜索
 *
 * @param {string} name 本子名
 * @returns 本子信息
 */
async function doSearch(name) {
  let json = await get(getSearchURL(`"${name}" chinese`)).then(r => r.data);
  if (json.result.length == 0) json = await get(getSearchURL(`"${name}"`)).then(r => r.data);
  if (json.result.length == 0) return false;
  return json.result[0];
}

export default doSearch;
