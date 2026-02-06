const { request } = require('playwright');
const { env } = require('./env');

const createApiContext = async () =>
  request.newContext({
    baseURL: env.baseUrl,
    extraHTTPHeaders: {
      'Content-Type': 'application/json'
    }
  });

const loginForToken = async (apiContext, username, password) => {
  const response = await apiContext.post('/api/auth/login', {
    data: { username, password }
  });

  if (!response.ok()) {
    throw new Error(`Login failed with status ${response.status()}`);
  }

  const body = await response.json();
  if (!body.token) {
    throw new Error('Login response did not include token.');
  }

  return body.token;
};

const authHeaders = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

const safeJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return undefined;
  }
};

module.exports = {
  createApiContext,
  loginForToken,
  authHeaders,
  safeJson
};
