import * as Cheerio from 'cheerio';
import NHentaiApi from 'nhentai-api';
import Axios from '../utils/axiosProxy.mjs';

const exts = {
  j: 'jpg',
  p: 'png',
  g: 'gif',
};

const nhentai = new NHentaiApi();

const getSearchURL = keyword => encodeURI(nhentai.search(keyword));

/**
 * nhentai搜索
 *
 * @param {string} name 本子名
 * @returns 本子信息
 */
export default name => {
  const mirrorOrigin = global.config.bot.getDoujinDetailFromNhentaiMirrorSite;
  return mirrorOrigin ? getDetailFromWebsite(mirrorOrigin, name) : getDetailFromNHentaiAPI(name);
};

async function getJsonWithPuppeteer(url) {
  const { puppeteer } = await import('../../libs/puppeteer/index.mjs');
  return await puppeteer.getJSON(url);
}

async function getDetailFromNHentaiAPI(name) {
  const get = global.config.bot.nHentaiUsePuppeteer ? getJsonWithPuppeteer : Axios.get;
  let json = await get(getSearchURL(`${name} chinese`)).then(r => r.data);
  if (json.result.length === 0) {
    json = await get(getSearchURL(name)).then(r => r.data);
    if (json.result.length === 0) return;
  }
  const data = json.result[0];

  return {
    url: `https://nhentai.net/g/${data.id}/`,
    thumb: `https://t.nhentai.net/galleries/${data.media_id}/cover.${exts[data.images.thumbnail.t]}`,
  };
}

async function getDetailFromWebsite(origin, name) {
  return (await _getDetailFromWebsite(origin, `${name} chinese`)) || (await _getDetailFromWebsite(origin, name));
}

async function _getDetailFromWebsite(origin, name) {
  const { data } = await Axios.get(`${origin}/search/?q=${encodeURIComponent(name)}`, { responseType: 'text' });
  const $ = Cheerio.load(data);

  const gallery = $('.gallery').get(0);
  if (!gallery) return;
  const $gallery = $(gallery);

  const href = $gallery.find('a').attr('href');
  if (!href) return;
  const url = `https://nhentai.net${href}`;

  const $img = $gallery.find('img');
  const thumb = $img.attr('data-src') || $img.attr('src');
  if (!thumb) return;

  return { url, thumb };
}
