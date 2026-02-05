/**
 * Authentication data for test automation
 * Contains user credentials for different roles
 */

const credentials = {
  admin: {
    username: 'admin',
    password: 'admin123'
  },
  user: {
    username: 'testuser',
    password: 'test123'
  }
};

const urls = {
  baseURL: 'http://localhost:8080',
  login: '/ui/login',
  dashboard: '/ui/dashboard',
  sales: '/ui/sales',
  sellPlant: '/ui/sales/new',
  plants: '/ui/plants',
  categories: '/ui/categories',
  inventory: '/ui/inventory'
};

module.exports = {
  credentials,
  urls
};
