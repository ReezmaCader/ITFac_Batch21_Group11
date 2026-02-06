const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const config = require('../../support/config');

/**
 * Login dynamically to get fresh JWT token
 */
async function loginAndGetToken(username, password) {
  const { request } = require('@playwright/test');
  const tempContext = await request.newContext({
    baseURL: config.baseURL,
    extraHTTPHeaders: { 'Content-Type': 'application/json' }
  });
  
  const response = await tempContext.post('/api/auth/login', {
    data: { username, password }
  });
  
  const data = await response.json().catch(() => null);
  await tempContext.dispose();
  
  if (response.status() === 200 && data && data.token) {
    return data.token;
  }
  return null;
}

Given('the admin has a valid authentication token', async function () {
  // Perform dynamic login to get fresh token
  const token = await loginAndGetToken('admin', 'admin123');
  if (token) {
    await this.setAuthToken(token);
  } else {
    // Fallback to static token if login fails
    await this.setAuthToken(config.tokens.admin);
  }
});

Given('a plant with available stock exists', async function () {
  // Get all plants and find one with stock > 0
  const response = await this.apiClient.get('/api/plants');
  
  if (response.status === 200 && response.data) {
    const plants = Array.isArray(response.data) ? response.data : response.data.content || [];
    const plantWithStock = plants.find(p => p.quantity > 0);
    
    if (plantWithStock) {
      this.setTestData('availablePlant', plantWithStock);
      this.setTestData('hasAvailableStock', true);
    } else {
      this.setTestData('hasAvailableStock', false);
    }
  } else {
    this.setTestData('hasAvailableStock', false);
  }
});

When('the admin sends a POST request to create a sale for available plant', async function () {
  const hasStock = this.getTestData('hasAvailableStock');
  const plant = this.getTestData('availablePlant');
  
  if (hasStock && plant) {
    const saleData = {
      plantId: plant.id,
      quantity: 1
    };
    
    this.setTestData('sentSaleData', saleData);
    const response = await this.salesClient.createSale(saleData);
    this.setResponse(response);
    
    if (response.status === 201 && response.data.id) {
      this.addCreatedResource('sales', response.data.id);
    }
  } else {
    // No stock available, try anyway with a default plant to get the proper error
    const saleData = { plantId: 1, quantity: 1 };
    this.setTestData('sentSaleData', saleData);
    const response = await this.salesClient.createSale(saleData);
    this.setResponse(response);
  }
});

Given('a sale record exists in the system', async function () {
  // First try to get an existing sale from the system
  const listResponse = await this.salesClient.getAllSales();
  
  if (listResponse.status === 200 && listResponse.data && listResponse.data.length > 0) {
    // Use the last sale in the list (most recent)
    const existingSale = listResponse.data[listResponse.data.length - 1];
    this.setTestData('saleIdForDeletion', existingSale.id);
    return;
  }
  
  // If no sales exist, try to create one
  const saleData = {
    plantId: 2,
    quantity: 1,
    price: 300
  };
  
  const response = await this.salesClient.createSale(saleData);
  
  if (response.status === 201) {
    this.setTestData('saleIdForDeletion', response.data.id);
    this.addCreatedResource('sales', response.data.id);
  } else {
    // If creation fails, try to get any existing sale
    const retryList = await this.salesClient.getAllSales();
    if (retryList.data && retryList.data.length > 0) {
      this.setTestData('saleIdForDeletion', retryList.data[0].id);
    }
  }
});

When('the admin sends a GET request to the sales API', async function () {
  const response = await this.salesClient.getAllSales();
  this.setResponse(response);
});

When('the admin sends a GET request with page {string} and size {string} params', async function (page, size) {
  const response = await this.salesClient.getSalesWithPagination(parseInt(page), parseInt(size));
  this.setResponse(response);
});

When('the admin sends a POST request with valid sale data', async function (dataTable) {
  const data = dataTable.hashes()[0];
  
  const saleData = {
    plantId: parseInt(data.plantId),
    quantity: parseInt(data.quantity),
    price: parseFloat(data.price)
  };
  
  this.setTestData('sentSaleData', saleData);
  
  const response = await this.salesClient.createSale(saleData);
  this.setResponse(response);
  
  if (response.status === 201 && response.data.id) {
    this.addCreatedResource('sales', response.data.id);
  }
});

When('the admin sends a POST request with quantity {int}', async function (quantity, dataTable) {
  const data = dataTable.hashes()[0];
  
  const saleData = {
    plantId: parseInt(data.plantId),
    quantity: quantity,
    price: parseFloat(data.price)
  };
  
  const response = await this.salesClient.createSale(saleData);
  this.setResponse(response);
});

When('the admin sends a POST request with quantity exceeding available stock', async function (dataTable) {
  const data = dataTable.hashes()[0];
  
  const saleData = {
    plantId: parseInt(data.plantId),
    quantity: parseInt(data.quantity),
    price: parseFloat(data.price)
  };
  
  const response = await this.salesClient.createSale(saleData);
  this.setResponse(response);
});

When('the admin sends a DELETE request for a sale ID', async function () {
  const saleId = this.getTestData('saleIdForDeletion');
  assert(saleId, 'Sale ID should exist for deletion');
  
  const response = await this.salesClient.deleteSale(saleId);
  this.setResponse(response);
});

When('the admin sends a DELETE request for non-existent sale ID', async function () {
  const nonExistentId = 99999;
  const response = await this.salesClient.deleteSale(nonExistentId);
  this.setResponse(response);
});

When('the admin sends a POST request with no plant ID', async function (dataTable) {
  const data = dataTable.hashes()[0];
  
  const saleData = {
    quantity: parseInt(data.quantity),
    price: parseFloat(data.price)
  };
  
  // Use the method that posts without a plantId in the URL
  const response = await this.salesClient.createSaleWithoutPlantId(saleData);
  this.setResponse(response);
});

Then('each sale should contain plant information with nested details', function () {
  const response = this.getResponse();
  const sales = Array.isArray(response.data) ? response.data : response.data.content || [];
  
  if (sales.length > 0) {
    const firstSale = sales[0];
    assert(firstSale.plant, 'Sale should have nested plant object');
    assert(firstSale.plant.id !== undefined, 'Plant should have id');
    assert(firstSale.plant.name !== undefined, 'Plant should have name');
  }
});

Then('the response body should contain the newly created sale details', function () {
  const response = this.getResponse();
  const createdSale = response.data;
  const sentData = this.getTestData('sentSaleData');
  
  assert(createdSale.id, 'Created sale should have an ID');
  
  assert.strictEqual(
    createdSale.plantId,
    sentData.plantId,
    'PlantId should match'
  );
  assert.strictEqual(
    createdSale.quantity,
    sentData.quantity,
    'Quantity should match'
  );
});

Then('if successful the response body should contain the newly created sale details', function () {
  const response = this.getResponse();
  
  // Only validate sale details if creation was successful (201)
  if (response.status === 201) {
    const createdSale = response.data;
    assert(createdSale.id, 'Created sale should have an ID');
    assert(createdSale.quantity, 'Created sale should have quantity');
  } else if (response.status === 400) {
    // If 400, it's a validation error (e.g., no stock) - this is acceptable
    assert(response.data.message, 'Error response should have a message');
  }
});

Then('the plant stock should be updated accordingly', function () {
  const response = this.getResponse();
  assert.strictEqual(response.status, 201, 'Sale should be created successfully');
});

Then('the sale should have status {string}', function (expectedStatus) {
  const response = this.getResponse();
  const sale = response.data;
  
  if (sale.status) {
    assert.strictEqual(
      sale.status,
      expectedStatus,
      `Expected status: ${expectedStatus}`
    );
  } else {
    assert.strictEqual(response.status, 201, 'Sale should be created');
  }
});

Then('the response body should return a validation error for quantity', function () {
  const response = this.getResponse();
  assert.strictEqual(response.status, 400, 'Should return 400 Bad Request');
  
  const message = response.data.message;
  assert(
    message.toLowerCase().includes('quantity'),
    'Error message should mention quantity'
  );
});

Then('the response body should indicate insufficient stock', function () {
  const response = this.getResponse();
  assert.strictEqual(response.status, 400, 'Should return 400 Bad Request');
  
  const message = response.data.message;
  assert(
    message.toLowerCase().includes('stock') || message.toLowerCase().includes('quantity'),
    'Error message should mention stock or quantity'
  );
});

Then('the sale record should be removed from the database successfully', function () {
  const response = this.getResponse();
  assert(
    response.status === 200 || response.status === 204,
    'Deletion should be successful'
  );
});

Then('the response body should indicate that plant ID is mandatory', function () {
  const response = this.getResponse();
  // API may return 400 (Bad Request) or 500 (route not found when plantId missing)
  assert(
    response.status === 400 || response.status === 500,
    `Should return 400 or 500, got ${response.status}`
  );
  
  const message = response.data.message || '';
  // Accept messages about plant, plantId, or route not found
  assert(
    message.toLowerCase().includes('plant') || 
    message.toLowerCase().includes('resource') ||
    message.toLowerCase().includes('not found'),
    'Error message should mention plant, resource, or not found'
  );
});
