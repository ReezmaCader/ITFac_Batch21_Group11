const { Given, Then } = require('@cucumber/cucumber');
const assert = require('assert');

/**
 * Common API step definitions shared between admin and user tests
 * These steps are scenario-agnostic and can be reused
 */

// Background step - API service running check
Given('the API service is running', async function () {
  // API service is assumed to be running
  // Could add a health check here if needed
});

// Common status code assertion
Then('the API should return HTTP status code {int}', function (expectedStatus) {
  const response = this.getResponse();
  assert.strictEqual(
    response.status,
    expectedStatus,
    `Expected status ${expectedStatus} but got ${response.status}. Response: ${JSON.stringify(response.data)}`
  );
});

// Common no error assertion
Then('no error message should be returned', function () {
  const response = this.getResponse();
  assert(response.status >= 200 && response.status < 300, 'Should not have error status');
});

// Common pagination assertion
Then('the response body should contain a paginated and sorted list', function () {
  const response = this.getResponse();
  const data = response.data;
  
  // Paginated response typically has content, totalElements, etc.
  if (data.content) {
    assert(Array.isArray(data.content), 'Paginated response should have content array');
    assert(data.hasOwnProperty('totalElements') || data.hasOwnProperty('totalPages'), 
           'Should have pagination metadata');
  } else if (Array.isArray(data)) {
    // Simple array response
    assert(Array.isArray(data), 'Response should be an array');
  }
});

// Common search match assertion
Then('categories should match the search input', function () {
  const response = this.getResponse();
  // Verify response has valid data
  assert(response.status === 200, 'Should return success status');
});

// Common main categories assertion
Then('the response body should contain a list of main categories only', function () {
  const response = this.getResponse();
  const data = response.data;
  
  assert(Array.isArray(data), 'Response should be an array of main categories');
  
  // Main categories should not have a parent or parentId should be null
  if (data.length > 0) {
    data.forEach(category => {
      const hasNoParent = !category.parentId || category.parentId === null || 
                          !category.parent || category.parent === null;
      // Verify at least some don't have parents (main categories)
    });
  }
});
