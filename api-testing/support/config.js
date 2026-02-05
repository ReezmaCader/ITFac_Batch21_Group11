module.exports = {
  baseURL: process.env.API_BASE_URL || 'http://localhost:8080',
  
  tokens: {
    user: process.env.USER_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsInJvbGVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3NzAyMDgzMjAsImV4cCI6MTc3MDIxMTkyMH0.kFjpBq_NHun6g1sdUrExGk_SzIiPw5RFuDHgRaCpb9Q',
    admin: process.env.ADMIN_TOKEN || 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwiaWF0IjoxNzcwMjA4Mzk2LCJleHAiOjE3NzAyMTE5OTZ9.6UIVT-qbAOAiZGQhdscoftFDUOqgbLo7tERakcQII44'
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
