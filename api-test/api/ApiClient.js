// Base HTTP client (reusable for any endpoint)

const { request } = require('@playwright/test');
const config = require('../support/config');

/**
 * Base API Client using Playwright's request context
 */
class ApiClient {
  constructor() {
    this.context = null;
    this.authToken = null;
    this.baseURL = config.baseURL;
  }

  async initialize() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    this.context = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: headers
    });
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  clearAuth() {
    this.authToken = null;
  }

  async reinitialize() {
    if (this.context) {
      await this.context.dispose();
    }
    await this.initialize();
  }

  async ensureContext() {
    if (!this.context) {
      await this.initialize();
    }
  }

  async safeParseJson(response) {
    try {
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  async get(endpoint, params = {}) {
    await this.ensureContext();
    
    let url = endpoint;
    if (Object.keys(params).length > 0) {
      const queryString = new URLSearchParams(params).toString();
      url = `${endpoint}?${queryString}`;
    }
    
    const response = await this.context.get(url);
    const data = await this.safeParseJson(response);
    return {
      status: response.status(),
      data,
      headers: response.headers()
    };
  }

  async post(endpoint, body = {}, queryParams = {}) {
    await this.ensureContext();
    
    let url = endpoint;
    if (Object.keys(queryParams).length > 0) {
      const queryString = new URLSearchParams(queryParams).toString();
      url = `${endpoint}?${queryString}`;
    }
    
    const response = await this.context.post(url, {
      data: body
    });
    const data = await this.safeParseJson(response);
    return {
      status: response.status(),
      data,
      headers: response.headers()
    };
  }

  async put(endpoint, body = {}) {
    await this.ensureContext();
    
    const response = await this.context.put(endpoint, {
      data: body
    });
    const data = await this.safeParseJson(response);
    return {
      status: response.status(),
      data,
      headers: response.headers()
    };
  }

  async delete(endpoint) {
    await this.ensureContext();
    
    const response = await this.context.delete(endpoint);
    const data = await this.safeParseJson(response);
    return {
      status: response.status(),
      data,
      headers: response.headers()
    };
  }

  async dispose() {
    if (this.context) {
      await this.context.dispose();
      this.context = null;
    }
  }
}

module.exports = ApiClient;