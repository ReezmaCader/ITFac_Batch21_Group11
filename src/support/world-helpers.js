const getPage = (world) => {
  if (!world.page) {
    throw new Error('Playwright page is not initialized.');
  }
  return world.page;
};

module.exports = { getPage };
