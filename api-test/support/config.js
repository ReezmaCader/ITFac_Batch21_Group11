module.exports = {
  baseURL: process.env.API_BASE_URL || 'http://localhost:8080',
  
  tokens: {
    user: process.env.USER_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3NzAyOTc0NjgsImV4cCI6MTc3MDMwMTA2OH0.KTnPI_XHmJg4E4nE-XPYsPh2JJnxdJQUoCAClgEHgvQ',
    admin: process.env.ADMIN_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwiaWF0IjoxNzcwMjk3NTA1LCJleHAiOjE3NzAzMDExMDV9.d14b47tlzdjQysV6djMvMwA3FSIj7b3W0vzRA7o40_s'
  },
  
  timeout: {
    default: 30000,
    long: 60000
  },
  
  endpoints: {
    sales: '/api/sales',
    plants: '/api/plants',
    auth: '/api/auth/login'
  },
  
  defaults: {
    pagination: {
      page: 0,
      size: 10
    }
  }
};
