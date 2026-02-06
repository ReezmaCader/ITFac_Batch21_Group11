module.exports = {
  baseURL: process.env.UI_BASE_URL || 'http://localhost:8080/ui',
  
  credentials: {
    admin: {
      username: 'admin',
      password: 'admin123'
    },
    user: {
      username: 'testuser',
      password: 'test123'
    }
  },
  
  timeout: {
    default: 30000,
    navigation: 10000,
    element: 5000
  },
  
  browser: {
    headless: process.env.HEADLESS !== 'false',
    slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0
  },
  
  pages: {
    login: '/login',
    dashboard: '/dashboard',
    sales: '/sales',
    sellPlant: '/sell-plant',
    plants: '/plants',
    categories: '/categories'
  }
};
