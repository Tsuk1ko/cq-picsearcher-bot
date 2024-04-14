/**
 * @template T
 * @param {T} item
 * @param {boolean} condition
 * @returns {[] | [T]}
 */
export const arrayIf = (item, condition) => (condition ? [item] : []);
