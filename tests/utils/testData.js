/**
 * Shared test data for Playwright spec tests
 * Re-exports from separate data files for backward compatibility
 * 
 * For new tests, prefer importing from specific data files:
 * - authData.js: credentials and URLs
 * - plantData.js: plant-related data
 */

// Import from separate data files
const { credentials, urls } = require('./authData');
const { plantData } = require('./plantData');

module.exports = {
  credentials,
  plantData,
  urls
};
