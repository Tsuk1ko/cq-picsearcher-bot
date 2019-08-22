import NHentaiApi from 'nhentai-api';
import { get } from './axiosProxy';

const nhentai = new NHentaiApi();

/**
 * nhentai搜索
 *
 * @param {string} name 本子名
 * @returns 本子信息
 */
async function doSearch(name) {
    let json = await get(nhentai.search(`"${name}" chinese`)).then(r => r.data);
    if (json.results.length == 0) json = await get(nhentai.search(`"${name}"`)).then(r => r.data);
    if (json.results.length == 0) return false;
    return json.results[0];
}

export default doSearch;
