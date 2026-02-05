const config = require('../support/config');

/**
 * Authentication Client for API Tests
 * Handles login and token management
 */
class AuthClient {
  constructor(apiClient) {
    this.apiClient = apiClient;
    this.basePath = config.endpoints.auth;
  }

  /**
   * Login with username and password
   * @param {string} username 
   * @param {string} password 
   * @returns {Promise<object>} Response with token
   */
  async login(username, password) {
    return await this.apiClient.post(this.basePath, {
      username,
      password
    });
  }

  /**
   * Login as admin user
   * @returns {Promise<object>} Response with admin token
   */
  async loginAsAdmin() {
    return await this.login('admin', 'admin123');
  }

  /**
   * Login as regular user
   * @returns {Promise<object>} Response with user token
   */
  async loginAsUser() {
    return await this.login('testuser', 'test123');
  }

  /**
   * Get stored admin token from config
   * @returns {string} Admin token
   */
  getAdminToken() {
    return config.tokens.admin;
  }

  /**
   * Get stored user token from config
   * @returns {string} User token
   */
  getUserToken() {
    return config.tokens.user;
  }
}

module.exports = AuthClient;
