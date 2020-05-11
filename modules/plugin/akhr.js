import { get } from '../axiosProxy';
import Fse from 'fs-extra';
import 'lodash.combinations';
import _ from 'lodash';
import Path from 'path';
import draw from './akhr.draw';

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
    const dataVersion = await get('https://www.bigfun.cn/tools/aktools/').then(({ data }) => /(?<=data_version=)[0-9]+/.exec(data));
    if (!dataVersion) throw new Error('方舟数据获取失败');
    const json = await get(`https://www.bigfun.cn/static/aktools/${dataVersion}/data/akhr.json`).then(r => r.data);
    json.sort((a, b) => b.level - a.level);
    const characters = [];
    const data = {};
    let charTagSum = 0;
    for (let character of json) {
        if (character.hidden) continue;
        let { level, name, sex, tags, type } = character;
        tags.push(`${sex}性干员`);
        tags.push(`${type}干员`);
        let p =
            characters.push({
                n: name,
                r: level,
            }) - 1;
        for (let tag of tags) {
            if (!data[tag]) data[tag] = [];
            data[tag].push(p);
        }
        charTagSum += tags.length;
    }
    let tagCount = _.size(data);
    return {
        characters,
        data,
        avgCharTag: charTagSum / tagCount,
    };
}

async function updateData() {
    AKDATA = await pullData();
    Fse.writeJsonSync(AKDATA_PATH, AKDATA);
}

async function init() {
    if (!Fse.existsSync(AKDATA_PATH)) await updateData();
    else AKDATA = Fse.readJsonSync(AKDATA_PATH);
}

function getCombinations(tags) {
    const combs = _.flatMap([1, 2, 3], v => _.combinations(tags, v));
    const result = [];
    for (let comb of combs) {
        const need = [];
        for (const tag of comb) need.push(AKDATA.data[tag]);
        const chars = _.intersection(...need);
        if (!comb.includes(GJZS)) _.remove(chars, i => getChar(i).r == 6);
        if (chars.length == 0) continue;

        let scoreChars = _.filter(chars, i => getChar(i).r >= 3);
        if (scoreChars.length == 0) scoreChars = chars;
        const score = _.sumBy(scoreChars, i => getChar(i).r) / scoreChars.length - comb.length / 10 - scoreChars.length / AKDATA.avgCharTag;

        const minI = _.minBy(scoreChars, i => getChar(i).r);

        result.push({
            comb,
            chars,
            min: AKDATA.characters[minI].r,
            score,
        });
    }
    result.sort((a, b) => (a.min == b.min ? b.score - a.score : b.min - a.min));
    return result;
}

function getResultText(words) {
    const tags = _.uniq(_.filter(words, w => w in AKDATA.data).slice(0, 6));
    const combs = getCombinations(tags);
    let text = `识别词条：${tags.join('、')}`;
    for (const r of combs) {
        text += `\n\n【${r.comb.join(' ')}】`;
        const tmp = [];
        for (let i of r.chars) {
            let char = getChar(i);
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
            // for tencent OCR
            w = w.replace('千员', '干员');
            // for baidu ocr
            if (w.includes(GJZS) && w.length > 6) {
                a.push(GJZS);
                let ws = w.split(GJZS);
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
