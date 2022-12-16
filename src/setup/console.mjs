const getTime = () => new Date().toLocaleString();

const { log, warn, error } = console;

console.log = (...args) => log(getTime(), ...args);
console.warn = (...args) => warn(getTime(), ...args);
console.error = (...args) => error(getTime(), ...args);
