import { createJimp } from '@jimp/core';
import bmp, { msBmp } from '@jimp/js-bmp';
import gif from '@jimp/js-gif';
import jpeg from '@jimp/js-jpeg';
import png from '@jimp/js-png';
import tiff from '@jimp/js-tiff';
import { methods as blit } from '@jimp/plugin-blit';
import { methods as rotate } from '@jimp/plugin-rotate';
import { webp } from './jimpWebp.mjs';

export { intToRGBA, rgbaToInt } from '@jimp/utils';

export const MIME_PNG = 'image/png';

const Jimp = createJimp({
  formats: [bmp, msBmp, gif, jpeg, png, tiff, webp],
  plugins: [blit, rotate],
});

export default Jimp;
