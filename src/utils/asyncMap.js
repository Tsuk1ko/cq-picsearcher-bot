export default async (array, func) => {
  const results = [];
  for (const [i, item] of Object.entries(array)) {
    results.push(await Promise.resolve(func(item, i)).catch(e => e));
  }
  return results;
};
