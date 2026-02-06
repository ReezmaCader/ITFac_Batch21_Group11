const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');
const { authHeaders, safeJson } = require('../support/api-client');
const {
  createPlant,
  createSubCategory,
  ensureAdminToken,
  ensureUserToken,
  getApiContext
} = require('../support/test-data');

const saveResponse = async (world, response) => {
  world.lastApiResponse = response;
  world.lastApiBody = await safeJson(response);
};

const createPlantAndSave = async (world) => {
  const result = await createPlant(world);
  await saveResponse(world, result.response);
};

Given('I am authenticated via API as {string}', async function (role) {
  const normalized = role.trim().toLowerCase();
  if (normalized === 'admin') {
    const token = await ensureAdminToken(this);
    this.apiToken = token;
    return;
  }
  if (normalized === 'user') {
    const token = await ensureUserToken(this);
    this.apiToken = token;
    return;
  }
  throw new Error(`Unknown role: ${role}`);
});

When('I request all plants via API', async function () {
  const api = getApiContext(this);
  const response = await api.get('/api/plants', {
    headers: authHeaders(this.apiToken)
  });
  await saveResponse(this, response);
});

When('I request the plant by id via API', async function () {
  if (!this.plantId) {
    await createPlant(this);
  }
  if (!this.plantId) {
    throw new Error('Plant was not created, cannot request by id.');
  }
  const api = getApiContext(this);
  const response = await api.get(`/api/plants/${this.plantId}`, {
    headers: authHeaders(this.apiToken)
  });
  await saveResponse(this, response);
});

When('I request the plant by invalid id via API', async function () {
  const api = getApiContext(this);
  const response = await api.get('/api/plants/999999', {
    headers: authHeaders(this.apiToken)
  });
  await saveResponse(this, response);
});

When('I request plants by category via API', async function () {
  if (!this.subCategoryId) {
    await createSubCategory(this);
  }
  if (!this.subCategoryId) {
    throw new Error('Category was not created, cannot request plants by category.');
  }
  const api = getApiContext(this);
  const response = await api.get(`/api/plants/category/${this.subCategoryId}`, {
    headers: authHeaders(this.apiToken)
  });
  await saveResponse(this, response);
});

When('I request plants by invalid category id via API', async function () {
  const api = getApiContext(this);
  const response = await api.get('/api/plants/category/999999', {
    headers: authHeaders(this.apiToken)
  });
  await saveResponse(this, response);
});

When('I create a plant via API', async function () {
  await createPlantAndSave(this);
});

When('I update the plant via API', async function () {
  if (!this.plantId) {
    await createPlant(this);
  }
  if (!this.plantId || !this.subCategoryId) {
    throw new Error('Plant was not created, cannot update.');
  }

  const token = await ensureAdminToken(this);
  const api = getApiContext(this);
  const response = await api.put(`/api/plants/${this.plantId}`, {
    headers: authHeaders(token),
    data: {
      name: `${this.plantName ?? 'AutoPlant'}-Updated`,
      price: 20.75,
      quantity: 9,
      categoryId: this.subCategoryId
    }
  });
  await saveResponse(this, response);
});

When('I update a plant with an invalid id via API', async function () {
  const token = await ensureAdminToken(this);
  const api = getApiContext(this);
  const response = await api.put('/api/plants/999999', {
    headers: authHeaders(token),
    data: {
      name: 'AutoPlant-Invalid',
      price: 15.5,
      quantity: 5,
      categoryId: this.subCategoryId ?? 1
    }
  });
  await saveResponse(this, response);
});

When('I delete the plant via API', async function () {
  if (!this.plantId) {
    await createPlant(this);
  }
  if (!this.plantId) {
    throw new Error('Plant was not created, cannot delete.');
  }

  const token = await ensureAdminToken(this);
  const api = getApiContext(this);
  const response = await api.delete(`/api/plants/${this.plantId}`, {
    headers: authHeaders(token)
  });
  await saveResponse(this, response);
});

When('I delete a plant with an invalid id via API', async function () {
  const token = await ensureAdminToken(this);
  const api = getApiContext(this);
  const response = await api.delete('/api/plants/999999', {
    headers: authHeaders(token)
  });
  await saveResponse(this, response);
});

Then('the API response status should be {int}', async function (status) {
  assert.ok(this.lastApiResponse, 'No API response recorded.');
  assert.equal(this.lastApiResponse.status(), status);
});

Then('the API response should be a list', async function () {
  assert.ok(Array.isArray(this.lastApiBody), 'Response body is not a list.');
});

Then('the API response should include an id', async function () {
  const body = this.lastApiBody ?? {};
  assert.ok(body.id, 'Response does not include id.');
});

Then('the API response should include field {string}', async function (field) {
  const body = this.lastApiBody ?? {};
  assert.ok(body && field in body, `Response body missing field: ${field}`);
});

Then('the API response items should include fields {string}', async function (fields) {
  assert.ok(Array.isArray(this.lastApiBody), 'Response body is not a list.');
  const [first] = this.lastApiBody;
  assert.ok(first, 'Response list is empty.');
  for (const field of fields.split(',').map((f) => f.trim()).filter(Boolean)) {
    assert.ok(field in first, `Expected field ${field} in response item.`);
  }
});
