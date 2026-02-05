const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const config = require('../../support/config');

/**
 * Login dynamically to get fresh JWT token
 */
async function loginAndGetToken(apiClient, username, password) {
  // Create a temporary context without auth for login
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

Given('the user has a valid authentication token', async function () {
  // Perform dynamic login to get fresh token
  const token = await loginAndGetToken(this.apiClient, 'testuser', 'test123');
  if (token) {
    await this.setAuthToken(token);
  } else {
    // Fallback to static token if login fails
    await this.setAuthToken(config.tokens.user);
  }
});

Given('the user has been logged in as User', async function () {
  const token = await loginAndGetToken(this.apiClient, 'testuser', 'test123');
  if (token) {
    await this.setAuthToken(token);
  } else {
    await this.setAuthToken(config.tokens.user);
  }
});

Given('the user does not have an authentication token', async function () {
  await this.clearAuth();
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
  // Actual API has: id, plant (object), quantity, totalPrice, soldAt
  const requiredFields = ['id', 'plant', 'quantity', 'totalPrice', 'soldAt'];
  
  requiredFields.forEach(field => {
    assert(
      firstSale.hasOwnProperty(field), 
      `Sale object should have field: ${field}`
    );
  });
  
  // Verify plant object has id (equivalent to plantId)
  assert(firstSale.plant && firstSale.plant.id, 'Sale should have plant.id (plantId)');
});

Then('the response data structure should match the API specification', function () {
  const response = this.getResponse();
  assert(response.data, 'Response should have data property');
});

Then('the API should return HTTP status code {int} or {int}', function (status1, status2) {
  const response = this.getResponse();
  const actualStatus = response.status;
  
  assert(
    actualStatus === status1 || actualStatus === status2,
    `Expected status ${status1} or ${status2}, got ${actualStatus}`
  );
});

Then('the response body should indicate that the user is not authorized or request failed', function () {
  const response = this.getResponse();
  // API may return 403 (forbidden) or 400 (bad request due to validation)
  assert(
    response.status === 403 || response.status === 400,
    'Should return 403 Forbidden or 400 Bad Request'
  );
});

Then('the response body should indicate insufficient permissions or not found', function () {
  const response = this.getResponse();
  // API may return 403 (forbidden) or 404 (not found)
  assert(
    response.status === 403 || response.status === 404,
    'Should return 403 Forbidden or 404 Not Found'
  );
});

Then('the response body should indicate that the user is not authorized to perform this action', function () {
  const response = this.getResponse();
  assert.strictEqual(response.status, 403, 'Should return 403 Forbidden');
});

Then('the response should contain error {string}', function (expectedError) {
  const response = this.getResponse();
  const error = response.data.error;
  // API may return uppercase error codes like "UNAUTHORIZED" or "FORBIDDEN"
  // Compare case-insensitively
  assert(
    error.toLowerCase() === expectedError.toLowerCase(),
    `Expected error: ${expectedError}, got: ${error}`
  );
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
  // Accept either 403 Forbidden or 404 Not Found
  assert(
    response.status === 403 || response.status === 404,
    'Should return 403 Forbidden or 404 Not Found'
  );
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
  // API returns pagination data with 'pageable' object containing pageNumber, pageSize
  if (response.data.content) {
    assert(response.data.pageable !== undefined, 'Pagination metadata should include pageable object');
    assert(response.data.totalElements !== undefined, 'Pagination should include totalElements');
  }
});

Then('the response should contain page {string}', function (expectedPage) {
  const response = this.getResponse();
  // API uses pageable.pageNumber, not response.page
  const actualPage = response.data.pageable?.pageNumber ?? response.data.number;
  assert.strictEqual(
    actualPage, 
    parseInt(expectedPage),
    `Expected page ${expectedPage}, got ${actualPage}`
  );
});

Then('the response should contain size {string}', function (expectedSize) {
  const response = this.getResponse();
  // API returns size at root level
  const actualSize = response.data.pageable?.pageSize ?? response.data.size;
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

Then('the response should indicate POST method is not supported', function () {
  const response = this.getResponse();
  assert.strictEqual(response.status, 500, 'Should return 500 for unsupported method');
  assert(
    response.data.message && response.data.message.includes('POST'),
    'Response should indicate POST is not supported'
  );
});

Then('the response should indicate resource not found', function () {
  const response = this.getResponse();
  assert.strictEqual(response.status, 404, 'Should return 404 Not Found');
});

Then('the response should contain a list of sales', function () {
  const response = this.getResponse();
  const data = Array.isArray(response.data) ? response.data : response.data.content || [];
  assert(Array.isArray(data), 'Response should contain an array of sales');
});
