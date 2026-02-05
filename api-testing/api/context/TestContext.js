const { setWorldConstructor } = require('@cucumber/cucumber');
const ApiClient = require('../base/ApiClient');
const SalesClient = require('../clients/SalesClient');
const config = require('../../support/config');

class TestContext {
  constructor() {
    this.apiClient = new ApiClient(config.baseURL);
    this.salesClient = new SalesClient(this.apiClient);
    this.testData = {};
    this.response = null;
    this.authToken = null;
    this.createdResources = {
      sales: []
    };
  }

  setAuthToken(token) {
    this.authToken = token;
    this.apiClient.setAuthToken(token);
  }

  clearAuth() {
    this.authToken = null;
    this.apiClient.setAuthToken(null);
  }

  setTestData(key, value) {
    this.testData[key] = value;
  }

  getTestData(key) {
    return this.testData[key];
  }

  setResponse(response) {
    this.response = response;
  }

  getResponse() {
    return this.response;
  }

  trackCreatedResource(type, id) {
    if (this.createdResources[type]) {
      this.createdResources[type].push(id);
    }
  }

  getCreatedResources(type) {
    return this.createdResources[type] || [];
  }
}

setWorldConstructor(TestContext);

module.exports = TestContext;
