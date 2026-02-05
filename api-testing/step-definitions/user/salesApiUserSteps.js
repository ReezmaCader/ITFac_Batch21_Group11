const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const config = require('../../support/config');

Given('the user has a valid authentication token', function () {
  const userToken = config.tokens.user;
  this.setAuthToken(userToken);
});

Given('the user has been logged in as User', function () {
  const userToken = config.tokens.user;
  this.setAuthToken(userToken);
});

Given('the user does not have an authentication token', function () {
  this.clearAuth();
});

When('the user sends a GET request to the sales API', async function () {
  const response = await this.salesClient.getAllSales();
  this.setResponse(response);
});

When('the user sends a POST request to the sales API', async function () {
  const saleData = {
    plantId: 1,
    quantity: 5,
    price: 450
  };
  const response = await this.salesClient.createSale(saleData);
  this.setResponse(response);
});

When('the user sends a DELETE request to the sales API', async function () {
  const saleId = 1;
  const response = await this.salesClient.deleteSale(saleId);
  this.setResponse(response);
});

When('the user sends a GET request with page {string} and size {string} params', async function (page, size) {
  const response = await this.salesClient.getSalesWithPagination(parseInt(page), parseInt(size));
  this.setResponse(response);
  
  this.setTestData('expectedPage', parseInt(page));
  this.setTestData('expectedSize', parseInt(size));
});

Then('the API should return HTTP status code {int}', function (expectedStatus) {
  const response = this.getResponse();
  assert.strictEqual(
    response.status, 
    expectedStatus, 
    `Expected status ${expectedStatus} but got ${response.status}`
  );
});

Then('the response body should contain a list of sales records', function () {
  const response = this.getResponse();
  const data = response.data;
  
  const salesList = data.content || data;
  
  assert(Array.isArray(salesList), 'Response should contain an array of sales');
  assert(salesList.length > 0, 'Sales list should not be empty');
});

Then('each sale object should include required fields such as id, plantId, quantity, price, and saleDate', function () {
  const response = this.getResponse();
  const salesList = response.data.content || response.data;
  
  const firstSale = salesList[0];
  const requiredFields = ['id', 'plantId', 'quantity', 'price', 'saleDate'];
  
  requiredFields.forEach(field => {
    assert(
      firstSale.hasOwnProperty(field), 
      `Sale object should have field: ${field}`
    );
  });
});

Then('the response data structure should match the API specification', function () {
  const response = this.getResponse();
  assert(response.data, 'Response should have data property');
});

Then('the response body should indicate that the user is not authorized to perform this action', function () {
  const response = this.getResponse();
  assert.strictEqual(response.status, 403, 'Should return 403 Forbidden');
});

Then('the response should contain error {string}', function (expectedError) {
  const response = this.getResponse();
  const error = response.data.error;
  assert.strictEqual(error, expectedError, `Expected error: ${expectedError}, got: ${error}`);
});

Then('the response should contain message {string}', function (expectedMessage) {
  const response = this.getResponse();
  const message = response.data.message;
  assert(
    message.includes(expectedMessage) || message === expectedMessage,
    `Expected message to contain: ${expectedMessage}, got: ${message}`
  );
});

Then('the response body should indicate insufficient permissions', function () {
  const response = this.getResponse();
  assert.strictEqual(response.status, 403, 'Should return 403 Forbidden');
});

Then('the response should return only the requested number of records based on page and size parameters', function () {
  const response = this.getResponse();
  const data = response.data;
  const expectedSize = this.getTestData('expectedSize');
  
  const content = data.content || data;
  assert(
    content.length <= expectedSize,
    `Expected at most ${expectedSize} records, got ${content.length}`
  );
});

Then('pagination metadata should be present if applicable', function () {
  const response = this.getResponse();
  if (response.data.content) {
    assert(response.data.page !== undefined, 'Pagination metadata should include page');
  }
});

Then('the response should contain page {string}', function (expectedPage) {
  const response = this.getResponse();
  const actualPage = response.data.page;
  assert.strictEqual(
    actualPage, 
    parseInt(expectedPage),
    `Expected page ${expectedPage}, got ${actualPage}`
  );
});

Then('the response should contain size {string}', function (expectedSize) {
  const response = this.getResponse();
  const actualSize = response.data.size;
  assert.strictEqual(
    actualSize,
    parseInt(expectedSize),
    `Expected size ${expectedSize}, got ${actualSize}`
  );
});

Then('the response should contain totalElements greater than {int}', function (minValue) {
  const response = this.getResponse();
  const totalElements = response.data.totalElements;
  assert(
    totalElements > minValue,
    `Expected totalElements > ${minValue}, got ${totalElements}`
  );
});

Then('the response body should indicate missing or invalid authentication', function () {
  const response = this.getResponse();
  assert.strictEqual(response.status, 401, 'Should return 401 Unauthorized');
});

Then('the response should contain status {int}', function (expectedStatus) {
  const response = this.getResponse();
  const status = response.data.status;
  assert.strictEqual(
    status,
    expectedStatus,
    `Expected status ${expectedStatus}, got ${status}`
  );
});
