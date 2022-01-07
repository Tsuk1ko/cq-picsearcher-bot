import emitter from '../../emitter';

/**
 * @type {import('@napi-rs/canvas')}
 */
let Canvas = null;
const loadCanvasModule = () => {
  if (global.config.bot.akhr.enable && !Canvas) {
    Canvas = require('../../../libs/canvas');
  }
};
emitter.onConfigLoad(loadCanvasModule);

const ratio = 2;
const fullWidth = ratio * 600;
const fullHeight = ratio * 4000;
const radius = ratio * 4;
const cardSpace = ratio * 5;
const lineSpace = ratio * 20;
const axPadding = ratio * 20;
const ayPadding = ratio * 20;
const xPadding = ratio * 10;
const yPadding = ratio * 8;
const fontSize = ratio * 16;
const cardHeight = fontSize + 2 * yPadding;

const colorPlan = {
  text: '#fff',
  tag: '#6c757d',
  recTag: '#313131',
  white: '#000',
  orange: '#e65100',
  6: '#dc3545',
  5: '#ff6d00',
  4: '#17a2b8',
  3: '#28a745',
  2: '#4e342e',
  1: '#343a40',
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
  const ctx = Canvas.createCanvas(fullWidth, fullHeight).getContext('2d');

  ctx.font = `${fontSize}px SarasaSC, SegoeUIEmoji`;
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
    const right = x + width;
    if (right > maxX) maxX = right;
    if (color) {
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
    }
    ctx.fillStyle = textColor;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + xPadding, y + yPadding + fontSize / 2);
    x += width + cardSpace;
  };

  drawCard('识别词条', '#1A237E');

  if (recTags.length === 0) drawCard('无', colorPlan.recTag);

  for (const recTag of recTags) {
    drawCard(recTag, colorPlan.recTag);
  }

  if (recTags.includes('高级资深干员')) {
    newLine();
    drawCard('🍋 检测到“高级资深干员”词条，请拉满 9 小时以确保不被划掉', colorPlan.orange);
  }
  if (recTags.includes('资深干员')) {
    newLine();
    drawCard('🍋 检测到“资深干员”词条，请拉满 9 小时以确保不被划掉', colorPlan.orange);
  }

  if (recTags.length < 5) {
    newLine();
    drawCard('注意：词条识别出现遗漏，请将词条部分裁剪出来再试', false, colorPlan.white);
  }

  for (const { comb, chars } of results) {
    newLine(true);
    for (const tag of comb) {
      drawCard(tag, colorPlan.tag);
    }
    newLine();
    for (const i of chars) {
      const char = AKDATA.characters[i];
      drawCard(char.n, colorPlan[char.r]);
    }
  }

  const w = maxX + axPadding;
  const h = y + cardHeight + ayPadding;
  const img = ctx.getImageData(0, 0, w, h);

  const newCanvas = Canvas.createCanvas(w, h);
  const newCtx = newCanvas.getContext('2d');
  newCtx.putImageData(img, 0, 0);

  return newCanvas.toDataURL('image/png').split(',')[1];
}

export default getImg;
