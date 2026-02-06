const { setWorldConstructor, World } = require('@cucumber/cucumber');
const ApiClient = require('../api/ApiClient');
const CategoryClient = require('../api/CategoryClient');
const config = require('./config');

/**
 * Custom World for API Tests
 * Provides test context with API clients and helper methods
 */
class CustomWorld extends World {
  constructor(options) {
    super(options);
    
    // Initialize API clients
    this.apiClient = new ApiClient();
    this.categoryClient = new CategoryClient(this.apiClient);
    
    // Test state
    this._response = null;
    this._testData = {};
    this._createdResources = {
      categories: []
    };
  }

  // Auth methods
  async setAuthToken(token) {
    this.apiClient.setAuthToken(token);
    await this.apiClient.reinitialize();
  }

  async clearAuth() {
    this.apiClient.clearAuth();
    await this.apiClient.reinitialize();
  }

  // Response methods
  setResponse(response) {
    this._response = response;
  }

  getResponse() {
    return this._response;
  }

  // Test data methods
  setTestData(key, value) {
    this._testData[key] = value;
  }

  getTestData(key) {
    return this._testData[key];
  }

  // Resource tracking methods
  addCreatedResource(type, id) {
    if (this._createdResources[type]) {
      this._createdResources[type].push(id);
    }
  }

  getCreatedResources(type) {
    return this._createdResources[type] || [];
  }

  clearCreatedResources(type) {
    if (this._createdResources[type]) {
      this._createdResources[type] = [];
    }
  }

  // Cleanup
  async cleanup() {
    if (this.apiClient) {
      await this.apiClient.dispose();
    }
  }
}

setWorldConstructor(CustomWorld);

module.exports = CustomWorld;
