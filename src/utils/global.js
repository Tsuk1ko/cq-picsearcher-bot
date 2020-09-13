export const globalReg = obj => Object.assign(global, obj);

globalReg({
  getTime: () => new Date().toLocaleString(),
});
