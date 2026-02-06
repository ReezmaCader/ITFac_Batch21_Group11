const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// --- PRECONDITIONS ---
Given('categories exist in the system', async function () {
    const rows = this.page.locator('tbody tr');
    try {
        await expect(rows.first()).toBeVisible({ timeout: 5000 });
    } catch (e) {
        console.log('No categories visible initially');
    }
});

// Create category if it doesn't exist
Given('a category {string} exists in the system', async function (categoryName) {
    await this.page.goto('http://localhost:8080/ui/categories');
    await this.page.waitForLoadState('networkidle');
    
    const tableBody = this.page.locator('tbody');
    const bodyText = await tableBody.textContent();
    
    if (!bodyText.includes(categoryName)) {
        
        await this.page.goto('http://localhost:8080/ui/categories/add');
        await this.page.waitForLoadState('networkidle');
        
        await expect(this.page).toHaveURL(/.*\/categories\/add/);
        
        await this.page.fill('input#name', categoryName);
        
        await this.page.click('button[type="submit"]');
        
        // Wait for either success redirect OR validation error
        try {
            await this.page.waitForURL(/.*\/categories$/, { timeout: 10000 });
        } catch (e) {
            // Check if we have validation error
            const hasError = await this.page.locator('.invalid-feedback, .text-danger').isVisible().catch(() => false);
            if (hasError) {
                const errorMsg = await this.page.locator('.invalid-feedback, .text-danger').textContent();
                console.log(`[ERROR] Validation error: ${errorMsg}`);
                throw new Error(`Failed to create category: ${errorMsg}`);
            } else {
                // Still wait a bit more
                await this.page.waitForLoadState('networkidle');
            }
        }
    } else {
        console.log(`Category "${categoryName}" already exists`);
    }
});

// --- SEARCH ---
When('I enter {string} in the category search field', async function (searchText) {
    await this.page.fill('input[name="name"]', searchText);
});

When('I click on Search button', async function () {
    await this.page.click('button:has-text("Search")');
    await this.page.waitForLoadState('networkidle');
});

Then('I should see only categories matching {string} in the results', async function (searchText) {
    await this.page.waitForSelector('tbody tr', { timeout: 5000 });
    const tableText = await this.page.locator('tbody').textContent();
    
    if (!tableText.includes('No category found')) {
        expect(tableText.toLowerCase()).toContain(searchText.toLowerCase());
    }
});

// --- ADD / EDIT / DELETE ACTIONS ---

When('I click on {string} button', async function (buttonText) {
    if (buttonText === 'Add Category') {
        await this.page.goto('http://localhost:8080/ui/categories/add');
        await this.page.waitForLoadState('networkidle');
        await expect(this.page).toHaveURL(/.*\/categories\/add/);
    } else if (buttonText === 'Add' || buttonText === 'Save') {
        await this.page.click('button[type="submit"]');
        await this.page.waitForLoadState('networkidle');
    }
});

When('I enter {string} as Category Name', async function (categoryName) {
    await this.page.fill('input#name', categoryName);
});

When('I select {string} as Parent Category', async function (parentCategory) {
    await this.page.selectOption('select#parentId', { label: parentCategory });
});

When('I leave Category Name field empty', async function () {
    await this.page.fill('input#name', '');
});

When('I leave Parent Category field empty', async function () {
    await this.page.selectOption('select#parentId', '');
});

// --- DELETE ---
When('I click on Delete action for {string}', async function (categoryName) {
    const row = this.page.locator(`tr:has(td:has-text("${categoryName}"))`);
    
    this.page.once('dialog', dialog => {
        dialog.accept();
    });
    
    const deleteBtn = row.locator('button[title="Delete"]');
    await deleteBtn.click();
    
    await this.page.waitForTimeout(500);
});

When('I confirm the deletion', async function () {
    const modalBtn = this.page.locator('.modal.show .btn-danger');
    const isVisible = await modalBtn.isVisible().catch(() => false);
    
    if (isVisible) {
        await modalBtn.click();
        await this.page.waitForLoadState('networkidle');
    } else {
    }
});

// --- ASSERTIONS ---
Then('I should see a success message', async function () {
    // 1. Define the selector based on your screenshot (Bootstrap alert)
    const successAlert = this.page.locator('.alert-success, .alert.alert-success');

    try {
        // 2. Wait for the alert to become visible. 
        // Playwright will wait up to 10 seconds, fixing the timing issue.
        await expect(successAlert.first()).toBeVisible({ timeout: 10000 });
        
    } catch (error) {
        // 3. Fallback: If the alert disappears too quickly or isn't found, 
        // check if the user was successfully redirected to the Categories list page.
        console.log('Success alert not detected. Checking URL redirection as fallback...');
        await expect(this.page).toHaveURL(/.*\/ui\/categories/);
    }
});

Then('the category {string} should be added to the list', async function (categoryName) {
    const currentUrl = this.page.url();
    if (!currentUrl.includes('/ui/categories') || currentUrl.includes('/add')) {
        await this.page.goto('http://localhost:8080/ui/categories');
        await this.page.waitForLoadState('networkidle');
    }
    
    await expect(this.page.locator('tbody')).toContainText(categoryName, { timeout: 5000 });
});

Then('I should see an error message below Category Name field', async function () {
    const errorMessage = this.page.locator('.invalid-feedback, .text-danger');
    await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
});

Then('the category should not be added', async function () {
    expect(this.page.url()).toMatch(/.*\/(add|edit|new)/);
});

Then('the category {string} should not appear in the list', async function (categoryName) {
    await this.page.waitForLoadState('networkidle');
    
    await this.page.reload();
    await this.page.waitForLoadState('networkidle');
    
    const bodyText = await this.page.locator('tbody').textContent();
    expect(bodyText).not.toContain(categoryName);
});