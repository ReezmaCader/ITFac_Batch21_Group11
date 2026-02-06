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

// --- Action Button Verification Steps ---

Then('the navigation menu should highlight {string} as active', async function (menuItem) {
    let selector = '';
    
    if (menuItem === 'Categories') {
        selector = '.sidebar a[href="/ui/categories"]';
    } else if (menuItem === 'Plants') {
        selector = '.sidebar a[href="/ui/plants"]';
    } else if (menuItem === 'Dashboard') {
        selector = '.sidebar a[href="/ui/dashboard"]';
    }
    
    const activeLink = this.page.locator(selector);
    await expect(activeLink).toHaveClass(/active/);
});

Then('I should see {string} message in the table', async function (message) {
    const tableBody = this.page.locator('tbody');
    await expect(tableBody).toContainText(message);
});

Then('I should NOT see the {string} button', async function (buttonText) {
    const addButton = this.page.locator('a.btn-primary', { hasText: buttonText });
    const count = await addButton.count();
    expect(count).toBe(0);
});

Then('the {string} buttons should be disabled', async function (buttonType) {
    if (buttonType === 'Edit') {
        const editButtons = this.page.locator('a.btn-outline-primary[title="Edit"]');
        const count = await editButtons.count();
        
        for (let i = 0; i < count; i++) {
            const button = editButtons.nth(i);
            // Check BOTH disabled AND hidden
            const isDisabled = await button.getAttribute('disabled');
            const isVisible = await button.isVisible();
            
            expect(isDisabled).toBe('disabled');
            expect(isVisible).toBe(false);
        }
    } else if (buttonType === 'Delete') {
        const deleteButtons = this.page.locator('button.btn-outline-danger[title="Delete"]');
        const count = await deleteButtons.count();
        
        for (let i = 0; i < count; i++) {
            const button = deleteButtons.nth(i);
            // Check BOTH disabled AND hidden
            const isDisabled = await button.getAttribute('disabled');
            const isVisible = await button.isVisible();
            
            expect(isDisabled).toBe('disabled');
            expect(isVisible).toBe(false);
        }
    }
});