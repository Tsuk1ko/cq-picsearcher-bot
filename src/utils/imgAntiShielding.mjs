import Jimp from 'jimp';
import { random } from 'lodash-es';

const RAND_MOD_PX = 0b1;
const ROTATE_LEFT = 0b10;
const ROTATE_RIGHT = 0b100;
const ROTATE_DOWN = 0b1000;

/**
 * 图片反和谐处理
 * @param {Jimp} img
 * @param {number} mode
 * @returns base64
 */
export async function imgAntiShielding(img, mode) {
  if (mode & RAND_MOD_PX) randomModifyPixels(img);

  if (mode & ROTATE_LEFT) img.simpleRotate(90);
  else if (mode & ROTATE_RIGHT) img.simpleRotate(-90);
  else if (mode & ROTATE_DOWN) img.simpleRotate(180);

  const base64 = await img.getBase64Async(Jimp.AUTO);
  return base64.split(',')[1];
}

/**
 * 随机修改四角像素
 * @param {Jimp} img
 */
function randomModifyPixels(img) {
  const [w, h] = [img.getWidth(), img.getHeight()];
  const pixels = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
  ];
  for (const [x, y] of pixels) {
    img.setPixelColor(Jimp.rgbaToInt(random(255), random(255), random(255), 1), x, y);
  }
}
