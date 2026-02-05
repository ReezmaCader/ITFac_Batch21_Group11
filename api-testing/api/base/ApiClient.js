const axios = require('axios');

class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json'
    };
  }

  setAuthToken(token) {
    if (token) {
      this.defaultHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      delete this.defaultHeaders['Authorization'];
    }
  }

  async get(endpoint, params = {}, headers = {}) {
    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        params,
        headers: { ...this.defaultHeaders, ...headers },
        validateStatus: () => true
      });
      return this._formatResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  async post(endpoint, data = {}, headers = {}) {
    try {
      const response = await axios.post(`${this.baseURL}${endpoint}`, data, {
        headers: { ...this.defaultHeaders, ...headers },
        validateStatus: () => true
      });
      return this._formatResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  async put(endpoint, data = {}, headers = {}) {
    try {
      const response = await axios.put(`${this.baseURL}${endpoint}`, data, {
        headers: { ...this.defaultHeaders, ...headers },
        validateStatus: () => true
      });
      return this._formatResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  async delete(endpoint, headers = {}) {
    try {
      const response = await axios.delete(`${this.baseURL}${endpoint}`, {
        headers: { ...this.defaultHeaders, ...headers },
        validateStatus: () => true
      });
      return this._formatResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  _formatResponse(response) {
    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data
    };
  }

  _handleError(error) {
    if (error.response) {
      return this._formatResponse(error.response);
    }
    throw error;
  }
}

module.exports = ApiClient;
