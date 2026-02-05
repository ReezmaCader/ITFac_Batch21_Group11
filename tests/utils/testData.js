/**
 * Shared test data for Playwright spec tests
 * Re-exports from separate data files for backward compatibility
 * 
 * For new tests, prefer importing from specific data files:
 * - authData.js: credentials and URLs
 * - plantData.js: plant-related data
 * - saleData.js: sale-related data and validation messages
 */

// Import from separate data files
const { credentials, urls } = require('./authData');
const { plantData } = require('./plantData');
const { saleData, salesTableColumns, validationMessages } = require('./saleData');

module.exports = {
  credentials,
  saleData,
  plantData,
  urls,
  validationMessages,
  salesTableColumns
};
