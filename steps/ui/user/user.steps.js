const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// --- Dashboard Verification Steps ---

Then('I should be on the Dashboard page', async function () {
    await expect(this.page).toHaveURL(/.*\/ui\/dashboard/);
});

Then('I should see the page header {string}', async function (headerText) {
    const header = this.page.locator('h3.mb-4');
    await expect(header).toHaveText(headerText);
});

// --- Sidebar Navigation Steps ---

When('I click on {string} in the sidebar', async function (menuItem) {
    let selector = '';
    
    if (menuItem === 'Categories') {
        selector = '.sidebar a[href="/ui/categories"]';
    } else if (menuItem === 'Plants') {
        selector = '.sidebar a[href="/ui/plants"]';
    } else if (menuItem === 'Sales') {
        selector = '.sidebar a[href="/ui/sales"]';
    } else if (menuItem === 'Dashboard') {
        selector = '.sidebar a[href="/ui/dashboard"]';
    }
    
    await this.page.click(selector);
    await this.page.waitForLoadState('networkidle');
});

// --- Summary Cards Verification ---

When('I am on the Dashboard page', async function () {
    await expect(this.page).toHaveURL(/.*\/ui\/dashboard/);
});

Then('I should see {string} summary card', async function (cardName) {
    const cardTitle = this.page.locator('.card-body h6.fw-semibold', { hasText: cardName });
    await expect(cardTitle).toBeVisible();
});

// --- Category Search Steps ---

When('I search for a category with name {string}', async function (categoryName) {
    await this.page.fill('input[name="name"]', categoryName);
    await this.page.click('button:has-text("Search")');
    await this.page.waitForLoadState('networkidle');
});