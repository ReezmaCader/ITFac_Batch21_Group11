const dotenv = require('dotenv');

dotenv.config();

const toBool = (value, defaultValue) => {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
};

const toNumber = (value, defaultValue) => {
  if (!value) return defaultValue;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

const env = {
  baseUrl: process.env.BASE_URL ?? 'http://localhost:8080',
  adminUser: process.env.ADMIN_USER ?? 'admin',
  adminPass: process.env.ADMIN_PASS ?? 'admin123',
  userUser: process.env.USER_USER ?? 'testuser',
  userPass: process.env.USER_PASS ?? 'test123',
  headless: toBool(process.env.HEADLESS, true),
  timeoutMs: toNumber(process.env.TIMEOUT_MS, 10000)
};

module.exports = { env };
