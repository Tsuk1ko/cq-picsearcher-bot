export default e => {
  if (typeof e === 'object' && e.stack) {
    console.error(e.stack);
    delete e.stack;
    if (e instanceof Error) {
      console.error(JSON.stringify(e, Object.getOwnPropertyNames(e), 2));
      return;
    }
  }
  console.error(e);
};
