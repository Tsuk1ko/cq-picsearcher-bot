import { existsSync } from 'fs';
import { resolve } from 'path';
import { IS_DOCKER } from '../../src/utils/env.mjs';
import { getDirname } from '../../src/utils/path.mjs';

const __dirname = getDirname(import.meta.url);

/** @type {import('@napi-rs/canvas') & import('canvas')} */
let Canvas;

let curUsingLibrary;

const CanvasLibrary = {
  RS_CANVAS: '@napi-rs/canvas',
  CANVAS: 'canvas',
};

const avaliableCanvasLibrary = new Set(Object.values(CanvasLibrary));

export const loadCanvasModule = async () => {
  if (Canvas) return Canvas;
  const useCanvasLibrary = IS_DOCKER ? CanvasLibrary.RS_CANVAS : global.config.bot.canvasLibrary;
  if (useCanvasLibrary === 'auto') {
    curUsingLibrary = existsSync(resolve(__dirname, './node_modules/canvas'))
      ? CanvasLibrary.CANVAS
      : CanvasLibrary.RS_CANVAS;
  } else if (avaliableCanvasLibrary.has(useCanvasLibrary)) {
    curUsingLibrary = useCanvasLibrary;
  } else {
    curUsingLibrary = CanvasLibrary.RS_CANVAS;
  }
  Canvas = await import(curUsingLibrary);
  console.log(`Use canvas library: ${curUsingLibrary}`);
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
