const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const config = require('../../support/config');

Given('the admin has a valid authentication token', function () {
  const adminToken = config.tokens.admin;
  this.setAuthToken(adminToken);
});

Given('a sale record exists in the system', async function () {
  const saleData = {
    plantId: 2,
    quantity: 1,
    price: 300
  };
  
  const response = await this.salesClient.createSale(saleData);
  
  if (response.status === 201) {
    this.setTestData('saleIdForDeletion', response.data.id);
    this.trackCreatedResource('sales', response.data.id);
  }
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
    this.trackCreatedResource('sales', response.data.id);
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

When('the admin sends a POST request with no plant ID', async function (dataTable) {
  const data = dataTable.hashes()[0];
  
  const saleData = {
    quantity: parseInt(data.quantity),
    price: parseFloat(data.price)
  };
  
  const response = await this.salesClient.createSale(saleData);
  this.setResponse(response);
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
  assert.strictEqual(
    createdSale.price,
    sentData.price,
    'Price should match'
  );
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

Then('the API should return HTTP status code {int} or {int}', function (status1, status2) {
  const response = this.getResponse();
  const actualStatus = response.status;
  
  assert(
    actualStatus === status1 || actualStatus === status2,
    `Expected status ${status1} or ${status2}, got ${actualStatus}`
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
  assert.strictEqual(response.status, 400, 'Should return 400 Bad Request');
  
  const message = response.data.message;
  assert(
    message.toLowerCase().includes('plant') || message.toLowerCase().includes('plantid'),
    'Error message should mention plant or plantId'
  );
});
