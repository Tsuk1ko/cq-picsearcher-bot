import '@jimp/core';

declare module '@jimp/core' {
  interface Jimp {
    /**
     * Rotates an image clockwise by a number of degrees rounded to the nearest 90 degrees.
     * @param {number} deg the number of degrees to rotate the image by
     */
    simpleRotate: (deg: number) => this;
  }
}
