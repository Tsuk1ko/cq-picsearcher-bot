/**
 * @template T
 * @template U
 * @typedef {(item: T, i: string) => Promise<U>} IterateeFunction
 */

/**
 * @template T
 * @template U
 * @param {T[]} array
 * @param {IterateeFunction<T, U>} func
 * @returns {Promise<U[]>}
 */
export default async (array, func) => {
  const results = [];
  for (const [i, item] of Object.entries(array)) {
    results.push(await Promise.resolve(func(item, i)).catch(e => e));
  }
  return results;
};
