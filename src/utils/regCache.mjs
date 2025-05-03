/** @type {Map<string, WeakMap<any, RegExp>>} */
const regCacheMap = new Map();

/**
 * @param {string} cacheKey
 */
const getRegCache = cacheKey => {
  let regCache = regCacheMap.get(cacheKey);
  if (!regCache) {
    regCache = new WeakMap();
    regCacheMap.set(cacheKey, regCache);
  }
  return regCache;
};

/**
 * @param {*} cacheTarget
 * @param {string} regexpKey
 * @param {string} [regexpFlagsKey]
 * @returns {RegExp}
 */
export const getRegWithCache = (cacheTarget, regexpKey, regexpFlagsKey) => {
  const regCache = getRegCache(regexpKey);
  let reg = regCache.get(cacheTarget);
  if (!reg) {
    reg = new RegExp(cacheTarget[regexpKey], regexpFlagsKey ? cacheTarget[regexpFlagsKey] : undefined);
    regCache.set(cacheTarget, reg);
  }
  return reg;
};

/**
 * @param {*} cacheTarget
 * @param {string} cacheKey
 * @param {() => RegExp} func
 * @returns
 */
export const createRegWithCache = (cacheTarget, cacheKey, func) => {
  const regCache = getRegCache(cacheKey);
  let reg = regCache.get(cacheTarget);
  if (!reg) {
    reg = func();
    regCache.set(cacheTarget, reg);
  }
  return reg;
};
