/*
 * @Author: Jindai Kirin
 * @Date: 2019-05-21 16:53:12
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2019-05-28 04:29:02
 */

import { get } from 'axios';
import Fse from 'fs-extra';
import 'lodash.combinations';
import _ from 'lodash';
import Path from 'path';
import draw from './akhr.draw';

const AKDATA_PATH = Path.resolve(__dirname, '../../data/akhr.json');
let AKDATA;

function getChar(i) {
	return AKDATA.characters[i];
}

async function pullData() {
	let json = await get('https://graueneko.github.io/akhr.json').then(r => r.data);
	json.sort((a, b) => b.level - a.level);
	let characters = [];
	let data = {};
	let charTagSum = 0;
	for (let character of json) {
		if (character.hidden) continue;
		let { level, name, sex, tags, type } = character;
		tags.push(`${sex}性干员`);
		tags.push(`${type}干员`);
		let p =
			characters.push({
				n: name,
				r: level
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
		avgCharTag: charTagSum / tagCount
	};
}

async function updateData() {
	AKDATA = await pullData();
	Fse.writeJsonSync(AKDATA_PATH, AKDATA);
}

function init() {
	if (!Fse.existsSync(AKDATA_PATH)) updateData();
	else AKDATA = Fse.readJsonSync(AKDATA_PATH);
}

function getCombinations(tags) {
	let combs = _.flatMap([1, 2, 3], v => _.combinations(tags, v));
	let result = [];
	for (let comb of combs) {
		let need = [];
		for (let tag of comb) need.push(AKDATA.data[tag]);
		let chars = _.intersection(...need);
		if (!comb.includes('高级资深干员')) _.remove(chars, i => getChar(i).r == 6);
		if (chars.length == 0) continue;

		let scoreChars = _.filter(chars, i => getChar(i).r >= 3);
		if (scoreChars.length == 0) scoreChars = chars;
		let score = _.sumBy(scoreChars, i => getChar(i).r) / scoreChars.length - comb.length / 10 - scoreChars.length / AKDATA.avgCharTag;

		let minI = _.minBy(scoreChars, i => getChar(i).r);

		result.push({
			comb,
			chars,
			min: AKDATA.characters[minI].r,
			score
		});
	}
	result.sort((a, b) => (a.min == b.min ? b.score - a.score : b.min - a.min));
	return result;
}

function getResultText(words) {
	let tags = _.uniq(_.filter(words, w => w in AKDATA.data).slice(0, 6));
	let combs = getCombinations(tags);
	let text = `识别词条：${tags.join('、')}`;
	for (let r of combs) {
		text += `\n\n【${r.comb.join(' ')}】`;
		let tmp = [];
		for (let i of r.chars) {
			let char = getChar(i);
			tmp.push(`(${char.r})${char.n}`);
		}
		text += tmp.join(' ');
	}
	return text;
}

function getResultImg(words) {
	let tags = _.uniq(_.filter(words, w => w in AKDATA.data).slice(0, 6));
	let combs = getCombinations(tags);
	return draw(AKDATA, combs, tags);
}

export default {
	init,
	updateData,
	getResultText,
	getResultImg
};
