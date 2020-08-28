/**
 * 提取 JSON
 *
 * @param {string} text
 */
export default text => {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  const jsonText = text.substring(start, end + 1);
  try {
    return JSON.parse(jsonText);
  } catch (error) {}
  return null;
};
