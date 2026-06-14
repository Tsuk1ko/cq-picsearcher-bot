import { random } from 'lodash-es';
import Jimp, { MIME_PNG, rgbaToInt } from './jimp.mjs';

const RAND_MOD_PX = 0b1;
const ROTATE_LEFT = 0b10;
const ROTATE_RIGHT = 0b100;
const ROTATE_DOWN = 0b1000;

/**
 * 图片反和谐处理
 * @param {ArrayBuffer} arrayBuffer
 * @param {number} mode
 * @returns base64
 */
export async function imgAntiShieldingFromArrayBuffer(arrayBuffer, mode) {
  const img = await Jimp.read(Buffer.from(arrayBuffer));
  return await imgAntiShielding(img, mode);
}

/**
 * 图片反和谐处理
 * @param {InstanceType<typeof Jimp>} img
 * @param {number} mode
 * @returns base64
 */
export async function imgAntiShielding(img, mode) {
  if (mode & RAND_MOD_PX) randomModifyPixels(img);

  if (mode & ROTATE_LEFT) img.rotate(90);
  else if (mode & ROTATE_RIGHT) img.rotate(-90);
  else if (mode & ROTATE_DOWN) img.rotate(180);

  const base64 = await img.getBase64(img.mime || MIME_PNG);
  return base64.split(',')[1];
}

/**
 * 随机修改四角像素
 * @param {InstanceType<typeof Jimp>} img
 */
function randomModifyPixels(img) {
  const [w, h] = [img.width, img.height];
  const pixels = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
  ];
  for (const [x, y] of pixels) {
    img.setPixelColor(rgbaToInt(random(255), random(255), random(255), 1), x, y);
  }
}
