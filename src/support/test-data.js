const { authHeaders, loginForToken } = require('./api-client');
const { env } = require('./env');

const getApiContext = (world) => {
  if (!world.apiContext) {
    throw new Error('API context is not initialized.');
  }
  return world.apiContext;
};

const ensureAdminToken = async (world) => {
  if (!world.adminToken) {
    world.adminToken = await loginForToken(
      getApiContext(world),
      env.adminUser,
      env.adminPass
    );
  }
  return world.adminToken;
};

const ensureUserToken = async (world) => {
  if (!world.userToken) {
    world.userToken = await loginForToken(
      getApiContext(world),
      env.userUser,
      env.userPass
    );
  }
  return world.userToken;
};

const createMainCategory = async (world, name = `MC${Date.now().toString().slice(-6)}`) => {
  const token = await ensureAdminToken(world);
  const api = getApiContext(world);
  const response = await api.post('/api/categories', {
    headers: authHeaders(token),
    data: { name }
  });

  let id;
  if (response.ok()) {
    const body = await response.json();
    id = body?.id;
    if (id) {
      world.mainCategoryId = id;
      world.mainCategoryName = name;
      world.createdCategoryIds.push(id);
    }
  }

  return { response, id, name };
};

const createSubCategory = async (world, name = `SC${Date.now().toString().slice(-6)}`) => {
  if (!world.mainCategoryId) {
    await createMainCategory(world);
  }
  const parentId = world.mainCategoryId;
  if (!parentId) {
    throw new Error('Main category is not available.');
  }

  const token = await ensureAdminToken(world);
  const api = getApiContext(world);
  const response = await api.post('/api/categories', {
    headers: authHeaders(token),
    data: { name, parent: { id: parentId } }
  });

  let id;
  if (response.ok()) {
    const body = await response.json();
    id = body?.id;
    if (id) {
      world.subCategoryId = id;
      world.subCategoryName = name;
      world.createdCategoryIds.push(id);
    }
  }

  return { response, id, name, parentId };
};

const createPlant = async (world, options = {}) => {
  if (!world.subCategoryId) {
    await createSubCategory(world);
  }
  const categoryId = world.subCategoryId;
  if (!categoryId) {
    throw new Error('Sub category is not available.');
  }

  const name = options.name ?? `PL${Date.now().toString().slice(-8)}`;
  const price = options.price ?? 10.5;
  const quantity = options.quantity ?? 12;

  const token = await ensureAdminToken(world);
  const api = getApiContext(world);
  const response = await api.post(`/api/plants/category/${categoryId}`, {
    headers: authHeaders(token),
    data: {
      name,
      price,
      quantity
    }
  });

  let id;
  if (response.ok()) {
    const body = await response.json();
    id = body?.id;
    if (id) {
      world.plantId = id;
      world.plantName = name;
      world.createdPlantIds.push(id);
    }
  }

  return { response, id, name, categoryId };
};

const sellPlant = async (world, quantity) => {
  if (!world.plantId) {
    await createPlant(world);
  }
  if (!world.plantId) {
    throw new Error('Plant is not available.');
  }

  const token = await ensureAdminToken(world);
  const api = getApiContext(world);
  const response = await api.post(`/api/sales/plant/${world.plantId}`, {
    headers: authHeaders(token),
    params: { quantity }
  });

  let id;
  if (response.ok()) {
    const body = await response.json();
    id = body?.id;
    if (id) {
      world.createdSaleIds.push(id);
    }
  }

  return { response, id };
};

module.exports = {
  getApiContext,
  ensureAdminToken,
  ensureUserToken,
  createMainCategory,
  createSubCategory,
  createPlant,
  sellPlant
};
