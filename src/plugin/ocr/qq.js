import _ from 'lodash';

/**
 * OCR 识别
 *
 * @param {{ file: string }} file 图片ID
 * @returns {Promise<string[]>} 识别结果
 */
export default async ({ file }) => {
  const {
    data: { texts },
  } = await global.bot('.ocr_image', { image: file });
  return _.map(texts, 'text');
};
