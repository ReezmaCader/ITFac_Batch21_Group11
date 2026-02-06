const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { login, navigateTo } = require('../../support/helpers');

Given('the user is logged in to the system', async function () {
  await login(this.page, 'user');
});

Given('the user navigates to the Sales page', async function () {
  await navigateTo(this.page, 'Sales');
});

Then('the system should allow to click on Sales', async function () {
  await expect(this.page).toHaveURL(/.*sales/);
});

Then('the system should display records with Plant name, Quantity, Total price, and Sold date', async function () {
  // Verify table headers (actual column names: Plant, Quantity, Total Price, Sold At)
  await expect(this.page.getByRole('columnheader', { name: 'Plant' })).toBeVisible();
  await expect(this.page.getByRole('columnheader', { name: 'Quantity' })).toBeVisible();
  await expect(this.page.getByRole('columnheader', { name: 'Total Price' })).toBeVisible();
  await expect(this.page.getByRole('columnheader', { name: 'Sold At' })).toBeVisible();
  
  // Verify records if they exist
  const rows = this.page.locator('table tbody tr');
  const recordCount = await rows.count();
  
  if (recordCount > 0) {
    const firstRow = rows.first();
    const cells = firstRow.locator('td');
    const cellCount = await cells.count();
    expect(cellCount).toBeGreaterThanOrEqual(4);
    
    // Verify first row has data
    const plantName = await cells.nth(0).textContent();
    expect(plantName).toBeTruthy();
    
    const quantity = await cells.nth(1).textContent();
    expect(quantity).toBeTruthy();
    
    const totalPrice = await cells.nth(2).textContent();
    expect(totalPrice).toBeTruthy();
    
    const soldDate = await cells.nth(3).textContent();
    expect(soldDate).toBeTruthy();
  }
});

Then('the system should display records sorted by sold date descending by default', async function () {
  const rows = this.page.locator('table tbody tr');
  const rowCount = await rows.count();
  
  if (rowCount > 1) {
    const dates = [];
    for (let i = 0; i < rowCount; i++) {
      const dateCell = await rows.nth(i).locator('td').nth(3).textContent();
      dates.push(dateCell);
    }
    
    // Verify dates are sorted in descending order (newest first)
    for (let i = 0; i < dates.length - 1; i++) {
      const currentDate = new Date(dates[i]);
      const nextDate = new Date(dates[i + 1]);
      expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
    }
  }
});

Then('the system should hide the {string} button for User role', async function (buttonName) {
  const button = this.page.getByRole('link', { name: buttonName });
  const isVisible = await button.isVisible();
  expect(isVisible).toBeFalsy();
});

Then('the system should hide the {string} action for User role', async function (actionName) {
  const deleteButtons = this.page.locator('table tbody tr button');
  const count = await deleteButtons.count();
  expect(count).toBe(0);
});

Then('the system should display a message as {string} when no records exist', async function (message) {
  const rows = this.page.locator('table tbody tr');
  const recordCount = await rows.count();
  
  if (recordCount === 0) {
    const noSalesMessage = this.page.getByText(message);
    await expect(noSalesMessage).toBeVisible();
  }
});
