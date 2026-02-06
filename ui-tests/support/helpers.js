const config = require('./config');

/**
 * Login helper function
 * @param {Page} page - Playwright page object
 * @param {string} role - 'admin' or 'user'
 */
async function login(page, role) {
  const credentials = config.credentials[role];
  if (!credentials) {
    throw new Error(`Unknown role: ${role}`);
  }
  
  await page.goto(`${config.baseURL}${config.pages.login}`);
  await page.getByRole('textbox', { name: 'Enter your username' }).fill(credentials.username);
  await page.getByRole('textbox', { name: 'Enter your password' }).fill(credentials.password);
  await page.getByRole('button', { name: 'Login' }).click();
}

/**
 * Navigate to a specific page
 * @param {Page} page - Playwright page object
 * @param {string} pageName - Name of the page (Sales, Plants, Categories, etc.)
 */
async function navigateTo(page, pageName) {
  const link = page.getByRole('link', { name: pageName, exact: true });
  await link.click();
  await page.waitForLoadState('networkidle');
}

/**
 * Get table row data
 * @param {Page} page - Playwright page object
 * @param {number} rowIndex - Row index (0-based)
 * @returns {Array<string>} Array of cell text contents
 */
async function getTableRowData(page, rowIndex) {
  const row = page.locator('table tbody tr').nth(rowIndex);
  const cells = row.locator('td');
  const count = await cells.count();
  
  const data = [];
  for (let i = 0; i < count; i++) {
    const text = await cells.nth(i).textContent();
    data.push(text?.trim() || '');
  }
  return data;
}

/**
 * Get all table rows count
 * @param {Page} page - Playwright page object
 * @returns {number} Number of rows
 */
async function getTableRowCount(page) {
  return await page.locator('table tbody tr').count();
}

module.exports = {
  login,
  navigateTo,
  getTableRowData,
  getTableRowCount
};
