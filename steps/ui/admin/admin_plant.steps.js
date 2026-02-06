const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// --- PRECONDITIONS ---

Given('a plant {string} exists in the system', async function (plantName) {
    await this.page.goto('http://localhost:8080/ui/plants');
    await this.page.waitForLoadState('networkidle');
    
    const tableBody = this.page.locator('tbody');
    const bodyText = await tableBody.textContent();
    
    if (!bodyText.includes(plantName)) {
        console.log(`[DEBUG] Plant "${plantName}" not found, creating...`);
        
        await this.page.goto('http://localhost:8080/ui/plants/add');
        await this.page.waitForLoadState('networkidle');
        
        await this.page.fill('input#name', plantName);
        
        // Select first available sub-category
        const categoryOptions = await this.page.locator('select#categoryId option').all();
        if (categoryOptions.length > 1) {
            const optionValue = await categoryOptions[1].getAttribute('value');
            await this.page.selectOption('select#categoryId', optionValue);
        }
        
        await this.page.fill('input#price', '100');
        await this.page.fill('input#quantity', '10');
        
        await this.page.getByRole('button', { name: 'Save' }).click();
        
        try {
            await this.page.waitForURL(/.*\/plants$/, { timeout: 10000 });
            console.log(`[DEBUG] Plant "${plantName}" created successfully`);
        } catch (e) {
            const hasError = await this.page.locator('.invalid-feedback, .text-danger').isVisible().catch(() => false);
            if (hasError) {
                const errorMsg = await this.page.locator('.invalid-feedback, .text-danger').textContent();
                console.log(`[ERROR] Validation error: ${errorMsg}`);
            }
        }
    } else {
        console.log(`[DEBUG] Plant "${plantName}" already exists`);
    }
});

// --- ACTIONS (Plant-specific only, not duplicating generic ones) ---

When('I click on Add Plant button', async function () {
    await this.page.goto('http://localhost:8080/ui/plants/add');
    await this.page.waitForLoadState('networkidle');
    //await expect(this.page).toHaveURL(/.*\/plants\/add/);
    await this.page.getByRole('button', { name: 'Save' }).click();
    
});

When('I click on Save button without entering any data', async function () {
    await this.page.getByRole('button', { name: 'Save' }).click();
    // Don't wait for navigation - form will show errors
    await this.page.waitForTimeout(1000);
});

When('I click on Save button', async function () {
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.waitForLoadState('networkidle');
});

When('I enter {string} as Plant Name', async function (plantName) {
    await this.page.fill('input#name', plantName);
});

When('I select a valid category', async function () {
    const categoryOptions = await this.page.locator('select#categoryId option').all();
    
    if (categoryOptions.length > 1) {
        const optionValue = await categoryOptions[1].getAttribute('value');
        const optionText = await categoryOptions[1].textContent();
        console.log('[DEBUG] Selecting category:', optionText);
        await this.page.selectOption('select#categoryId', optionValue);
    }
});

When('I select a main category', async function () {
    await this.page.selectOption('select#categoryId', { index: 1 });
});

When('I enter {string} as Price', async function (price) {
    await this.page.fill('input#price', price);
});

When('I enter {string} as Quantity', async function (quantity) {
    await this.page.fill('input#quantity', quantity);
});

When('I click on Edit action for plant {string}', async function (plantName) {
    console.log(`[DEBUG] Looking for plant: "${plantName}"`);
    
    await this.page.waitForSelector('tbody tr', { timeout: 10000 });
    
    const rows = await this.page.locator('tbody tr').all();
    console.log(`[DEBUG] Found ${rows.length} rows`);
    
    let found = false;
    
    for (let i = 0; i < rows.length; i++) {
        const rowText = await rows[i].textContent();
        
        if (rowText.includes(plantName)) {
            console.log(`[DEBUG] Found plant in row ${i + 1}`);
            
            const editBtn = rows[i].locator('a[title="Edit"]');
            const editBtnCount = await editBtn.count();
            
            if (editBtnCount > 0) {
                console.log('[DEBUG] Clicking edit button');
                await editBtn.click();
                await this.page.waitForLoadState('networkidle');
                found = true;
                break;
            }
        }
    }
    
    if (!found) {
        throw new Error(`Plant "${plantName}" not found for editing`);
    }
});

When('I change the plant name to {string}', async function (newName) {
    await this.page.fill('input#name', newName);
});

// --- ASSERTIONS ---

Then('I should see validation messages under all required fields', async function () {
    const validationMessages = this.page.locator('.invalid-feedback, .text-danger');
    const count = await validationMessages.count();
    
    console.log(`[DEBUG] Found ${count} validation messages`);
    expect(count).toBeGreaterThan(0);
});

Then('I should see an error message stating {string}', async function (errorMessage) {
    const errorElement = this.page.locator('form .invalid-feedback, form .text-danger');
    await expect(errorElement.first()).toBeVisible({ timeout: 5000 });
    
    const actualText = await errorElement.first().textContent();
    console.log('[DEBUG] Error message:', actualText);
    
    expect(actualText.toLowerCase()).toContain(errorMessage.toLowerCase());
});

Then('I should see a validation error', async function () {
    const errorElement = this.page.locator('.invalid-feedback, .text-danger, .alert-danger');
    await expect(errorElement.first()).toBeVisible({ timeout: 5000 });
});

Then('I should see a plant success message', async function () {
    // 1. Define the success alert locator
    // Based on your screenshot, the success box has class 'alert-success'
    const successAlert = this.page.locator('.alert-success');

    try {
        // 2. Wait explicitly for the alert to become visible (up to 10 seconds)
        // This handles the delay while the page reloads after saving
        await expect(successAlert).toBeVisible({ timeout: 10000 });
        
        const text = await successAlert.textContent();
        console.log(`[DEBUG] ✅ Success message found: "${text.trim()}"`);
        
    } catch (timeoutError) {
        // 3. If success message is NOT found, check for validation errors.
        
        // 🛑 CRITICAL FIX: We add 'form' before the classes.
        // This ensures we only look for errors inside the form, IGNORING the "Logout" button.
        const formError = this.page.locator('form .invalid-feedback, form .text-danger');
        
        if (await formError.count() > 0 && await formError.first().isVisible()) {
            const errorText = await formError.first().textContent();
            throw new Error(`❌ Validation Error prevented save: ${errorText.trim()}`);
        }
        
        // If no form error exists, but success message is also missing
        throw new Error(`❌ Success message did not appear. Current URL: ${this.page.url()}`);
    }
});

Then('the plant {string} should appear in the list', async function (featureFileName) {
    const nameToVerify = this.updatedPlantName || featureFileName;
    
    console.log(`[DEBUG] Searching for plant: ${nameToVerify}`);

    const currentUrl = this.page.url();
    if (!currentUrl.includes('/ui/plants') || currentUrl.includes('/add') || currentUrl.includes('/edit')) {
        await this.page.goto('http://localhost:8080/ui/plants');
        await this.page.waitForLoadState('networkidle');
    }

    const searchInput = this.page.getByPlaceholder('Search plant'); 
    await searchInput.fill(nameToVerify);
    
    await this.page.getByRole('button', { name: 'Search', exact: true }).click();
    
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000); 

    const tableBody = this.page.locator('tbody');
    await expect(tableBody).toContainText(nameToVerify, { timeout: 10000 });
    
    console.log(`✅ Plant "${nameToVerify}" found in the list.`);
});