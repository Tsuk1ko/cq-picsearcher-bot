/*
 * @Author: Jindai Kirin
 * @Date: 2019-05-22 01:57:10
 * @Last Modified by: Jindai Kirin
 * @Last Modified time: 2019-05-22 03:08:06
 */

import { createCanvas } from 'canvas';

const fullWidth = 600;
const fullHeight = 4000;
const radius = 4;
const cardSpace = 5;
const lineSpace = 20;
const axPadding = 20;
const ayPadding = 20;
const xPadding = 8;
const yPadding = 4;
const lineHeight = 20;
const cardHeight = lineHeight + 2 * yPadding;

const colorPlan = {
	text: '#fff',
	tag: '#6c757d',
	6: '#dc3545',
	5: '#ff6d00',
	4: '#17a2b8',
	3: '#28a745',
	2: '#4e342e',
	1: '#343a40'
};

/**
 * 绘制结果图
 *
 * @param {Object} AKDATA 干员数据
 * @param {Array} results 结果
 * @param {Array} recTags 识别词条
 * @returns
 */
function getImg(AKDATA, results, recTags) {
	const canvas = createCanvas(fullWidth, fullHeight);
	const ctx = canvas.getContext('2d');

	ctx.font = '14px "Microsoft YaHei"';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, fullWidth, fullHeight);

	let x = axPadding;
	let y = ayPadding;
	let maxX = 0;

	const newLine = (large = false) => {
		x = axPadding;
		y += cardHeight + (large ? lineSpace : cardSpace);
	};

	const drawCard = (text, color, textColor = colorPlan.text) => {
		const width = ctx.measureText(text).width + 2 * xPadding;
		if (x + width + axPadding > fullWidth) newLine();
		let right = x + width + axPadding;
		if (right > maxX) maxX = right;
		ctx.beginPath();
		ctx.arc(x + radius, y + radius, radius, Math.PI, (Math.PI * 3) / 2);
		ctx.lineTo(width - radius + x, y);
		ctx.arc(width - radius + x, radius + y, radius, (Math.PI * 3) / 2, Math.PI * 2);
		ctx.lineTo(width + x, cardHeight + y - radius);
		ctx.arc(width - radius + x, cardHeight - radius + y, radius, 0, (Math.PI * 1) / 2);
		ctx.lineTo(radius + x, cardHeight + y);
		ctx.arc(radius + x, cardHeight - radius + y, radius, (Math.PI * 1) / 2, Math.PI);
		ctx.closePath();
		ctx.fillStyle = color;
		ctx.fill();
		ctx.fillStyle = textColor;
		ctx.fillText(text, x + xPadding, y + yPadding - 1 + lineHeight / 2);
		x += width + cardSpace;
	};

	drawCard('识别词条', '#1A237E');

	for (let recTag of recTags) {
		drawCard(recTag, '#313131');
	}

	for (let { comb, chars } of results) {
		newLine(true);
		for (let tag of comb) {
			drawCard(tag, colorPlan.tag);
		}
		newLine();
		for (let i of chars) {
			let char = AKDATA.characters[i];
			drawCard(char.n, colorPlan[char.r]);
		}
	}

	let w = maxX;
	let h = y + cardHeight + ayPadding;
	let img = ctx.getImageData(0, 0, w, h);

	const newCanvas = createCanvas(w, h);
	const newCtx = newCanvas.getContext('2d');
	newCtx.putImageData(img, 0, 0);

	return newCanvas.toDataURL().split(',')[1];
}

export default getImg;
