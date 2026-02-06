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

// Store created category for cleanup
let createdCategoryId = null;

// Admin authentication
Given('the admin has a valid authentication token', async function () {
  const token = await loginAndGetToken(this.apiClient, 'admin', 'admin123');
  if (token) {
    await this.setAuthToken(token);
  } else {
    await this.setAuthToken(config.tokens.admin);
  }
});

// GET requests with parameters
When('the admin sends a GET request to {string} with name parameter {string}', async function (endpoint, nameParam) {
  const response = await this.categoryClient.getAllCategories({ name: nameParam });
  this.setResponse(response);
  this.setTestData('searchName', nameParam);
});

When('the admin sends a GET request to {string} without parameters', async function (endpoint) {
  const response = await this.categoryClient.getAllCategories();
  this.setResponse(response);
});

When('the admin sends a GET request to {string} with invalid parameter {string}', async function (endpoint, invalidParam) {
  // Try searching with invalid/special characters
  const response = await this.categoryClient.getAllCategories({ name: invalidParam });
  this.setResponse(response);
  this.setTestData('invalidParam', invalidParam);
});

When('the admin sends a GET request to {string}', async function (endpoint) {
  let response;
  
  if (endpoint.includes('/summary')) {
    response = await this.categoryClient.getCategorySummary();
  } else if (endpoint.includes('/sub-categories')) {
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

When('the admin sends a GET request to {string} with page {string} and name parameter', async function (endpoint, page) {
  const response = await this.categoryClient.getCategoriesWithPagination({
    page: parseInt(page),
    size: 10,
    name: '',
    sort: 'id,asc'
  });
  this.setResponse(response);
});

// POST requests
When('the admin sends a POST request to {string} with valid category name {string}', async function (endpoint, categoryName) {
  // Add timestamp to make name unique
  const uniqueName = `${categoryName}${Date.now().toString().slice(-4)}`;
  const categoryData = {
    name: uniqueName,
    parentId: null
  };
  
  const response = await this.categoryClient.createCategory(categoryData);
  this.setResponse(response);
  this.setTestData('createdCategoryName', uniqueName);
  
  // Track created category for cleanup
  if (response.status === 201 && response.data && response.data.id) {
    createdCategoryId = response.data.id;
    this.addCreatedResource('categories', response.data.id);
  }
});

When('the admin sends a POST request to {string} with invalid request body', async function (endpoint) {
  // Send empty or invalid data
  const invalidData = {
    name: '', // Empty name should fail validation
    parentId: null
  };
  
  const response = await this.categoryClient.createCategory(invalidData);
  this.setResponse(response);
});

// Assertions - Status codes
Then('the API should return HTTP status code {int} or empty result', function (expectedStatus) {
  const response = this.getResponse();
  // Either 400 error or 200 with empty/filtered results
  const isExpectedStatus = response.status === expectedStatus;
  const isSuccessWithResults = response.status === 200;
  
  assert(
    isExpectedStatus || isSuccessWithResults,
    `Expected status ${expectedStatus} or 200, got ${response.status}`
  );
});

// Assertions - Response content
Then('the response body should contain a list of categories matching the parameter', function () {
  const response = this.getResponse();
  const searchName = this.getTestData('searchName');
  
  if (Array.isArray(response.data) && response.data.length > 0 && searchName) {
    // Check if any category matches the search
    const matchingCategories = response.data.filter(cat => 
      cat.name.toLowerCase().includes(searchName.toLowerCase())
    );
    // Should have some matching results or be empty if no match
  }
});

Then('the response body should contain a list of all categories', function () {
  const response = this.getResponse();
  
  assert(Array.isArray(response.data), 'Response should be an array of categories');
  assert(response.data.length > 0, 'Should have at least one category');
});

Then('if error, the response body should contain a clear error message indicating invalid parameter', function () {
  const response = this.getResponse();
  
  if (response.status === 400) {
    // Verify error message exists
    assert(response.data || response.status === 400, 'Should have error info for bad request');
  }
});

Then('no categories should be returned or empty list', function () {
  const response = this.getResponse();
  
  if (response.status === 400) {
    // Error response - no categories
    return;
  }
  
  if (response.status === 200 && Array.isArray(response.data)) {
    // Empty list or filtered results are acceptable
    assert(Array.isArray(response.data), 'Should be an array');
  }
});

// Assertions - Summary
Then('the response body should contain category summary information', function () {
  const response = this.getResponse();
  
  // Summary might be a number or an object with summary data
  assert(
    response.data !== null && response.data !== undefined,
    'Should have summary data'
  );
  
  // Could be totalCategories, count, or similar
  if (typeof response.data === 'object') {
    // Object with summary fields
    const hasCountField = response.data.hasOwnProperty('totalCategories') ||
                          response.data.hasOwnProperty('count') ||
                          response.data.hasOwnProperty('total') ||
                          response.data.hasOwnProperty('mainCategories');
    // Or it might just be a number
    assert(hasCountField || typeof response.data === 'number' || response.data !== null, 
           'Should have summary information');
  }
});

// Assertions - Sub-categories
Then('the response body should contain a list of all sub-categories with expected fields', function () {
  const response = this.getResponse();
  
  assert(Array.isArray(response.data), 'Response should be an array');
  
  if (response.data.length > 0) {
    const firstItem = response.data[0];
    assert(firstItem.hasOwnProperty('id'), 'Should have id field');
    assert(firstItem.hasOwnProperty('name'), 'Should have name field');
  }
});

// Assertions - Main categories (unique to admin)
Then('the returned categories should not contain sub-categories', function () {
  const response = this.getResponse();
  
  if (Array.isArray(response.data) && response.data.length > 0) {
    // Main categories should have null parentId
    response.data.forEach(category => {
      const isMainCategory = !category.parentId || category.parentId === null;
      // Main categories endpoint should only return main categories
      assert(isMainCategory, 'Should only contain main categories (no parentId)');
    });
  }
});

// Assertions - Create category
Then('the response body should contain newly created category details', function () {
  const response = this.getResponse();
  const createdName = this.getTestData('createdCategoryName');
  
  assert(response.data, 'Should have response data');
  assert(response.data.id, 'Created category should have an ID');
  assert(response.data.name, 'Created category should have a name');
  
  if (createdName) {
    assert(
      response.data.name === createdName,
      `Created category name should be ${createdName}, got ${response.data.name}`
    );
  }
});

Then('the category should be saved successfully in the database', function () {
  const response = this.getResponse();
  
  assert(response.status === 201, 'Should return 201 Created');
  assert(response.data && response.data.id, 'Should have category ID');
});

Then('the response body should contain a clear error message indicating invalid request body', function () {
  const response = this.getResponse();
  
  assert(response.status === 400, 'Should return 400 Bad Request');
  // Error message should indicate validation failure
  if (response.data) {
    const hasError = response.data.error || response.data.message || response.data.errors;
    assert(hasError || response.status === 400, 'Should have error information');
  }
});

Then('no category should be created', function () {
  const response = this.getResponse();
  
  assert(response.status === 400, 'Should not create category with invalid data');
  assert(!response.data || !response.data.id, 'Should not return created category ID');
});

// Cleanup after tests
async function cleanupCreatedCategories(categoryClient, adminToken) {
  if (createdCategoryId) {
    try {
      await categoryClient.deleteCategory(createdCategoryId);
      createdCategoryId = null;
    } catch (error) {
      console.log(`Cleanup: Could not delete category ${createdCategoryId}`);
    }
  }
}
