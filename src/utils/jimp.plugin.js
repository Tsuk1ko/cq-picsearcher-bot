import Jimp from 'jimp';

function rotate90degrees(bitmap, dstBuffer, clockwise) {
  const dstOffsetStep = clockwise ? -4 : 4;
  let dstOffset = clockwise ? dstBuffer.length - 4 : 0;

  let tmp;
  let x;
  let y;
  let srcOffset;

  for (x = 0; x < bitmap.width; x++) {
    for (y = bitmap.height - 1; y >= 0; y--) {
      srcOffset = (bitmap.width * y + x) << 2;
      tmp = bitmap.data.readUInt32BE(srcOffset, true);
      dstBuffer.writeUInt32BE(tmp, dstOffset, true);
      dstOffset += dstOffsetStep;
    }
  }
}

/**
 * Rotates an image clockwise by a number of degrees rounded to the nearest 90 degrees. NB: 'this' must be a Jimp object.
 * @param {number} deg the number of degrees to rotate the image by
 */
Jimp.prototype.simpleRotate = function (deg) {
  let steps = Math.round(deg / 90) % 4;
  steps += steps < 0 ? 4 : 0;

  if (steps === 0) return;

  const srcBuffer = this.bitmap.data;
  const len = srcBuffer.length;
  const dstBuffer = Buffer.allocUnsafe(len);

  let tmp;

  if (steps === 2) {
    for (let srcOffset = 0; srcOffset < len; srcOffset += 4) {
      tmp = srcBuffer.readUInt32BE(srcOffset, true);
      dstBuffer.writeUInt32BE(tmp, len - srcOffset - 4, true);
    }
  } else {
    rotate90degrees(this.bitmap, dstBuffer, steps === 1);

    tmp = this.bitmap.width;
    this.bitmap.width = this.bitmap.height;
    this.bitmap.height = tmp;
  }

  this.bitmap.data = dstBuffer;
};
