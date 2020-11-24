import Fse from 'fs-extra';
import 'lodash.combinations';
import _ from 'lodash';
import Path from 'path';
import draw from './akhr.draw';
import { get } from 'axios';

const GJZS = '高级资深干员';

const AKDATA_PATH = Path.resolve(__dirname, '../../data/akhr.json');
let AKDATA = null;

function isDataReady() {
  return !!AKDATA;
}

function getChar(i) {
  return AKDATA.characters[i];
}

async function pullData() {
  const [charData, charNameData, tagData] = _.map(
    await Promise.all([
      get('https://cdn.jsdelivr.net/gh/arkntools/arknights-toolbox@master/src/data/character.json'),
      get('https://cdn.jsdelivr.net/gh/arkntools/arknights-toolbox@master/src/locales/cn/character.json'),
      get('https://cdn.jsdelivr.net/gh/arkntools/arknights-toolbox@master/src/locales/cn/tag.json'),
    ]),
    'data'
  );
  let charTagSum = 0;
  const result = _.transform(
    Object.entries(charData)
      .filter(([, { recruitment }]) => recruitment.includes(0))
      .sort(([, { star: a }], [, { star: b }]) => b - a),
    ({ characters, data }, [id, { star, position, profession, tags }], i) => {
      characters.push({ n: charNameData[id], r: star });
      const tagNames = [position, profession, ...tags].map(tid => tagData[tid]);
      switch (star) {
        case 5:
          tagNames.push(tagData[14]);
          break;
        case 6:
          tagNames.push(tagData[11]);
          break;
      }
      tagNames.forEach(tag => {
        if (!data[tag]) data[tag] = [];
        data[tag].push(i);
      });
      charTagSum += tagNames.length;
    },
    { characters: [], data: {} }
  );
  result.avgCharTag = charTagSum / _.size(result.data);
  return result;
}

async function updateData() {
  try {
    AKDATA = await pullData();
    Fse.writeJsonSync(AKDATA_PATH, AKDATA);
  } catch (error) {
    throw new Error('方舟数据获取失败');
  }
}

async function init() {
  if (!Fse.existsSync(AKDATA_PATH)) await updateData();
  else AKDATA = Fse.readJsonSync(AKDATA_PATH);
}

function getCombinations(tags) {
  const combs = _.flatMap([1, 2, 3], v => _.combinations(tags, v));
  const result = [];
  for (const comb of combs) {
    const need = [];
    for (const tag of comb) need.push(AKDATA.data[tag]);
    const chars = _.intersection(...need);
    if (!comb.includes(GJZS)) _.remove(chars, i => getChar(i).r === 6);
    if (chars.length === 0) continue;

    let scoreChars = _.filter(chars, i => getChar(i).r >= 3);
    if (scoreChars.length === 0) scoreChars = chars;
    const score =
      _.sumBy(scoreChars, i => getChar(i).r) / scoreChars.length -
      comb.length / 10 -
      scoreChars.length / AKDATA.avgCharTag;

    const minI = _.minBy(scoreChars, i => getChar(i).r);

    result.push({
      comb,
      chars,
      min: AKDATA.characters[minI].r,
      score,
    });
  }
  result.sort((a, b) => (a.min === b.min ? b.score - a.score : b.min - a.min));
  return result;
}

function getResultText(words) {
  const tags = _.uniq(_.filter(words, w => w in AKDATA.data).slice(0, 6));
  const combs = getCombinations(tags);
  let text = `识别词条：${tags.join('、')}`;
  for (const r of combs) {
    text += `\n\n【${r.comb.join(' ')}】`;
    const tmp = [];
    for (const i of r.chars) {
      const char = getChar(i);
      tmp.push(`(${char.r})${char.n}`);
    }
    text += tmp.join(' ');
  }
  return text;
}

function getResultImg(words) {
  let tags = _.transform(
    words,
    (a, w) => {
      //  for tencent OCR
      w = w.replace('千员', '干员');
      //  for baidu OCR
      if (w.includes(GJZS) && w.length > 6) {
        a.push(GJZS);
        const ws = w.split(GJZS);
        _.each(ws, v => {
          if (v.length > 0 && v in AKDATA.data) a.push(v);
        });
      }

      if (w in AKDATA.data) a.push(w);
    },
    []
  );
  tags = _.uniq(tags).slice(0, 6);
  const combs = getCombinations(tags);
  return draw(AKDATA, combs, tags);
}

export default {
  init,
  isDataReady,
  updateData,
  getResultText,
  getResultImg,
};
