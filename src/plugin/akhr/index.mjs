import Path from 'path';
import Axios from 'axios';
import Fs from 'fs-extra';
import _ from 'lodash-es';
import emitter from '../../utils/emitter.mjs';
import logError from '../../utils/logError.mjs';
import { getDirname } from '../../utils/path.mjs';
import { createRegWithCache } from '../../utils/regCache.mjs';
import draw from './akhr.draw.mjs';

const __dirname = getDirname(import.meta.url);

const TOP_OP = '高级资深干员';

const DATA_PATH = Path.resolve(__dirname, '../../../data/akhr.json');
let DATA = null;
let updateInterval = null;

emitter.onConfigReady(init);

emitter.onConfigReload(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }
  init();
});

function isDataReady() {
  return !!DATA;
}

function getCharRarity(i) {
  return DATA.characters[i].r;
}

function getTagCharsetExcludeRegExp() {
  if (!isDataReady()) throw new Error('方舟公招数据未初始化');
  const charset = _.uniq(Object.keys(DATA.data).flatMap(tag => tag.split(''))).join('');
  return createRegWithCache(DATA, 'tagCharsetExcludeRegExp', () => new RegExp(`[^${charset}]`, 'g'));
}

async function pullData() {
  const {
    data: { data },
  } = await Axios.get('https://zonai.skland.com/h5/v1/game/recruit/character');
  const tagId2Name = Object.fromEntries(data.tags.map(({ tagId, tagName }) => [tagId, tagName]));
  let charTagSum = 0;
  const result = _.transform(
    data.characters.sort((a, b) => b.rarity - a.rarity),
    ({ characters, data }, { name, rarity, tagIds }, i) => {
      characters.push({ n: name, r: rarity + 1 });
      tagIds.forEach(id => {
        const name = tagId2Name[id];
        (data[name] || (data[name] = [])).push(i);
      });
      charTagSum += tagIds.length;
    },
    { characters: [], data: {} },
  );
  result.avgCharTag = charTagSum / _.size(result.data);
  return result;
}

async function updateData() {
  try {
    DATA = await pullData();
    Fs.writeJsonSync(DATA_PATH, DATA);
  } catch (e) {
    console.error('方舟公招数据更新');
    logError(e);
    return false;
  }
  return true;
}

function setUpdateDataInterval() {
  const intervalHours = global.config.bot.akhr.updateInterval;
  if (intervalHours >= 1) {
    updateInterval = setInterval(updateData, intervalHours * 3600000);
  }
}

async function init() {
  if (!global.config.bot.akhr.enable) return;
  try {
    if (!Fs.existsSync(DATA_PATH)) await updateData();
    else DATA = Fs.readJsonSync(DATA_PATH);
    setUpdateDataInterval();
  } catch (e) {
    console.error('akhr 初始化');
    logError(e);
  }
}

function getCombinations(tags) {
  const combs = [1, 2, 3].flatMap(v => _.combinations(tags, v));
  const result = [];
  for (const comb of combs) {
    const need = [];
    for (const tag of comb) need.push(DATA.data[tag]);
    const chars = _.intersection(...need);
    if (!comb.includes(TOP_OP)) _.remove(chars, i => getCharRarity(i) === 6);
    if (chars.length === 0) continue;

    let scoreChars = _.filter(chars, i => getCharRarity(i) >= 3);
    if (scoreChars.length === 0) scoreChars = chars;
    const score =
      _.sumBy(scoreChars, i => getCharRarity(i)) / scoreChars.length -
      comb.length / 10 -
      scoreChars.length / DATA.avgCharTag;

    const minI = _.minBy(scoreChars, i => getCharRarity(i));

    result.push({
      comb,
      chars,
      min: DATA.characters[minI].r,
      score,
    });
  }
  result.sort((a, b) => (a.min === b.min ? b.score - a.score : b.min - a.min));
  return result;
}

const ERROR_MAP = {
  千员: '干员',
  于员: '干员',
  滅速: '減速',
  枳械: '机械',
  冫口了: '治疗',
};

function getResultImg(words) {
  const excludeRegExp = getTagCharsetExcludeRegExp();
  let tags = _.transform(
    words,
    (a, w) => {
      w = _.reduce(ERROR_MAP, (cur, correct, error) => cur.replace(error, correct), w);
      w = w.replace(excludeRegExp, '');

      //  for baidu OCR
      if (w.includes(TOP_OP) && w.length > 6) {
        a.push(TOP_OP);
        const ws = w.split(TOP_OP);
        _.each(ws, v => {
          if (v.length > 0 && v in DATA.data) a.push(v);
        });
      }

      if (w in DATA.data) a.push(w);
      else if (w.length === 4 && w.endsWith('干员')) {
        const w2 = w.slice(0, 2);
        if (w2 in DATA.data) {
          a.push({ origTag: w, toString: () => w2 });
        }
      }
    },
    [],
  );
  tags = _.uniq(tags).slice(0, 5);
  const combs = getCombinations(tags);
  return draw(DATA, combs, tags);
}

export default {
  init,
  isDataReady,
  updateData,
  getResultImg,
};
