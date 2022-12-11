/**
 * @param {number} num
 * @returns {number | string}
 */
export default num => (num < 10000 ? num : `${(num / 10000).toFixed(1)}万`);
