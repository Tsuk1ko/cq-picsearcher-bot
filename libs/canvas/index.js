import { resolve } from 'path';
import { existsSync } from 'fs-extra';

/** @type {import('@napi-rs/canvas') & import('canvas')} */
let Canvas;

let curUsingLibrary;

const CanvasLibrary = {
  RS_CANVAS: '@napi-rs/canvas',
  CANVAS: 'canvas',
};

const avaliableCanvasLibrary = new Set(Object.values(CanvasLibrary));

const load = () => {
  if (Canvas) return Canvas;
  const useCanvasLibrary = global.config.bot.canvasLibrary;
  if (useCanvasLibrary === 'auto') {
    curUsingLibrary = existsSync(resolve(__dirname, './node_modules/canvas'))
      ? CanvasLibrary.CANVAS
      : CanvasLibrary.RS_CANVAS;
  } else if (avaliableCanvasLibrary.has(useCanvasLibrary)) {
    curUsingLibrary = useCanvasLibrary;
  } else {
    curUsingLibrary = CanvasLibrary.RS_CANVAS;
  }
  Canvas = require(curUsingLibrary);
  console.log(`${global.getTime()} Use canvas library: ${curUsingLibrary}`);
  loadFonts('SarasaSC', 'sarasa-gothic-sc-bold.ttf');
  loadFonts('SegoeUIEmoji', 'seguiemj.ttf');
  return Canvas;
};

const loadFonts = (name, file) => {
  switch (curUsingLibrary) {
    case CanvasLibrary.RS_CANVAS:
      Canvas.GlobalFonts.registerFromPath(resolve(__dirname, 'fonts', file), name);
      break;
    case CanvasLibrary.CANVAS:
      Canvas.registerFont(resolve(__dirname, 'fonts', file), { family: name });
      break;
  }
};

module.exports = load();
