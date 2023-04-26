import Fs from 'fs-extra';
import { getDataPath } from './path.mjs';

const safeReadJsonSync = path => {
  try {
    return Fs.readJsonSync(path);
  } catch (error) {
    console.error('[KVStore] read json failed', path);
    console.error(error);
    return {};
  }
};

export const useKVStore = name => {
  if (!name) throw new Error('[KVStore] no name');

  const dataPath = getDataPath(`${name}.json`);
  const obj = Fs.existsSync(dataPath) ? safeReadJsonSync(dataPath) : {};

  /**
   * @param {keyof typeof Reflect} cmd
   */
  const reflectAndSaveData =
    cmd =>
    (...args) => {
      const ret = Reflect[cmd](...args);
      Fs.writeJsonSync(dataPath, obj);
      return ret;
    };

  return new Proxy(obj, {
    set: reflectAndSaveData('set'),
    deleteProperty: reflectAndSaveData('deleteProperty'),
  });
};
