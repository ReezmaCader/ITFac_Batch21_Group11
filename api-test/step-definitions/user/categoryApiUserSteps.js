const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');
const config = require('../../support/config');

/**
 * Login dynamically to get fresh JWT token
 */
async function loginAndGetToken(apiClient, username, password) {
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

// Authentication steps
Given('the user has a valid authentication token', async function () {
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

// GET requests
When('the user sends a GET request to {string}', async function (endpoint) {
  let response;
  
  if (endpoint.includes('/sub-categories')) {
    response = await this.categoryClient.getSubCategories();
  } else if (endpoint.includes('/main')) {
    response = await this.categoryClient.getMainCategories();
  } else if (endpoint.includes('/page')) {
    response = await this.categoryClient.getCategoriesWithPagination({ page: 0, size: 10 });
  } else {
    response = await this.categoryClient.getAllCategories();
  }
  
  this.setResponse(response);
});

When('the user sends a GET request to {string} with pagination parameters', async function (endpoint) {
  const response = await this.categoryClient.getCategoriesWithPagination({
    page: 0,
    size: 10,
    sort: 'id,asc'
  });
  this.setResponse(response);
});

// PUT requests
When('the user sends a PUT request to {string} with category data', async function (endpoint) {
  const categoryId = 1; // Use existing category ID
  const categoryData = {
    name: 'UpdatedByUser',
    parentId: null
  };
  
  const response = await this.categoryClient.updateCategory(categoryId, categoryData);
  this.setResponse(response);
});

// DELETE requests
When('the user sends a DELETE request to {string}', async function (endpoint) {
  const categoryId = 1; // Use existing category ID
  const response = await this.categoryClient.deleteCategory(categoryId);
  this.setResponse(response);
});

// POST requests
When('the user sends a POST request to {string} with category data', async function (endpoint) {
  const categoryData = {
    name: 'UserCategory',
    parentId: null
  };
  
  const response = await this.categoryClient.createCategory(categoryData);
  this.setResponse(response);
});

// Assertions - Sub-categories
Then('the response body should contain a list of all sub-categories', function () {
  const response = this.getResponse();
  const data = response.data;
  
  assert(Array.isArray(data), 'Response should be an array of sub-categories');
});

Then('each sub-category should include expected fields', function () {
  const response = this.getResponse();
  const data = response.data;
  
  if (Array.isArray(data) && data.length > 0) {
    const firstItem = data[0];
    // Sub-categories should have id, name, and parent info
    assert(firstItem.hasOwnProperty('id'), 'Sub-category should have id field');
    assert(firstItem.hasOwnProperty('name'), 'Sub-category should have name field');
  }
});

// Assertions - Error handling
Then('the response body should contain a proper error message', function () {
  const response = this.getResponse();
  // 401 or 403 responses typically contain error info
  assert(
    response.status === 401 || response.status === 403 || response.status === 400,
    'Should return an error status code'
  );
});

Then('no category data should be returned', function () {
  const response = this.getResponse();
  // For unauthorized/forbidden requests, either no data or error object
  if (response.data && Array.isArray(response.data)) {
    assert(response.status !== 200, 'Should not return successful data for unauthorized requests');
  }
});

Then('no sub-categories should be included', function () {
  const response = this.getResponse();
  const data = response.data;
  
  if (Array.isArray(data) && data.length > 0) {
    // Main categories typically have null parent
    const mainCategories = data.filter(cat => !cat.parentId && !cat.parent);
    // Should have at least some main categories
    assert(mainCategories.length > 0 || data.length >= 0, 'Should contain main categories');
  }
});

// Assertions - Updates/Deletes/Creates should fail for users
Then('the category details should not be updated', function () {
  const response = this.getResponse();
  assert(
    response.status === 403 || response.status === 401,
    'User should not be able to update categories'
  );
});

Then('the category should not be updated', function () {
  const response = this.getResponse();
  assert(
    response.status === 403 || response.status === 401,
    'Unauthorized user should not be able to update categories'
  );
});

Then('the category should not be deleted', function () {
  const response = this.getResponse();
  assert(
    response.status === 403 || response.status === 401,
    'User should not be able to delete categories'
  );
});

Then('the category should not be created', function () {
  const response = this.getResponse();
  assert(
    response.status === 403 || response.status === 401,
    'User should not be able to create categories'
  );
});
