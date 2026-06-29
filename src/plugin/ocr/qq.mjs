import { retryAsync } from '../../utils/retry.mjs';

/**
 * OCR 识别
 *
 * @param {{ file: string }} file 图片ID
 * @returns {Promise<string[]>} 识别结果
 */
export default async ({ file }) =>
  retryAsync(async () => {
    const { data, retcode, message } = await global.bot('ocr_image', { image: file });
    if (retcode !== 0) {
      throw new Error(`[OCR ERROR] ${message}`);
    }
    return data.texts.map(item => item.text);
  });
