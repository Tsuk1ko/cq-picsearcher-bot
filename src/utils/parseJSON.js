import CQ from '../CQcode';

/**
 * 提取 JSON
 *
 * @param {string} text
 */
export default text => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  let jsonText = text.substring(start, end + 1);
  if (text.includes('[CQ:json,')) jsonText = CQ.unescape(jsonText);
  try {
    return JSON.parse(jsonText);
  } catch (error) {}
  return null;
};
