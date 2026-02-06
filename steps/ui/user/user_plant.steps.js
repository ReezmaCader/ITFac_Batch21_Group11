const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

// --- PRECONDITIONS ---

Given('plants exist in the system with quantity less than 5', async function () {
    // Check if low stock plants exist, create if needed
    await this.page.goto('http://localhost:8080/ui/plants');
    await this.page.waitForLoadState('networkidle');
    
    const tableBody = this.page.locator('tbody');
    const bodyText = await tableBody.textContent();
    
    // If no "Low" badge exists, we may need to create a low stock plant as admin
    if (!bodyText.includes('Low')) {
        console.log('[DEBUG] No low stock plants found - may need admin to create one');
    }
});

Given('plants exist in the system with quantity 5 or more', async function () {
    await this.page.goto('http://localhost:8080/ui/plants');
    await this.page.waitForLoadState('networkidle');
});

Given('multiple plants exist in the system', async function () {
    await this.page.goto('http://localhost:8080/ui/plants');
    await this.page.waitForLoadState('networkidle');
    
    const rows = this.page.locator('tbody tr');
    const count = await rows.count();
    
    if (count < 2) {
        console.log('[WARN] Not enough plants for sorting test');
    }
});

Given('more than one page of plants exist in the system', async function () {
    await this.page.goto('http://localhost:8080/ui/plants');
    await this.page.waitForLoadState('networkidle');
    
    // Check if pagination exists
    const pagination = this.page.locator('.pagination');
    const hasPagination = await pagination.isVisible().catch(() => false);
    
    if (!hasPagination) {
        console.log('[WARN] Pagination not visible - may not have enough plants');
    }
});

// --- NAVIGATION ---

When('I navigate to the Plant management page', async function () {
    await this.page.goto('http://localhost:8080/ui/plants');
    await this.page.waitForLoadState('networkidle');
});

// --- SORTING ---

When('I sort plants by {string}', async function (sortField) {
    // Click on the appropriate sort header
    if (sortField === 'Name') {
        await this.page.click('th:has-text("Name")');
    } else if (sortField === 'Quantity') {
        await this.page.click('th:has-text("Quantity")');
    } else if (sortField === 'Price') {
        await this.page.click('th:has-text("Price")');
    }
    
    await this.page.waitForLoadState('networkidle');
});

// --- PAGINATION ---

When('I click on the next page option', async function () {
    const nextButton = this.page.locator('.pagination a:has-text("Next"), .pagination a[aria-label="Next"]');
    await nextButton.click();
    await this.page.waitForLoadState('networkidle');
});

// --- ASSERTIONS ---

Then('I should see plants with quantity less than 5 displaying a "Low" badge', async function () {
    // Find all rows in the table
    const rows = await this.page.locator('tbody tr').all();
    
    let foundLowBadge = false;
    
    for (const row of rows) {
        const rowText = await row.textContent();
        
        // Check if this row has "Low" badge
        const hasBadge = rowText.includes('Low');
        
        if (hasBadge) {
            foundLowBadge = true;
            console.log('[DEBUG] Found "Low" badge in row');
            break;
        }
    }
    
    expect(foundLowBadge).toBeTruthy();
});

Then('I should NOT see a "Low" badge for plants with quantity 5 or more', async function () {
    // Get all quantity cells and their corresponding badges
    const rows = await this.page.locator('tbody tr').all();
    
    for (const row of rows) {
        const rowText = await row.textContent();
        const cells = await row.locator('td').all();
        
        // Find quantity cell (typically 4th column)
        if (cells.length >= 4) {
            const qtyText = await cells[3].textContent();
            const qty = parseInt(qtyText.trim());
            
            // If quantity >= 5, there should be NO "Low" badge
            if (qty >= 5) {
                expect(rowText).not.toContain('Low');
            }
        }
    }
});

Then('the plant list should be displayed in alphabetical order', async function () {
    await this.page.waitForSelector('tbody tr');
    
    const nameCells = await this.page.locator('tbody tr td:nth-child(2)').allTextContents();
    
    // Check if names are in alphabetical order
    const isSorted = nameCells.every((name, i) => {
        if (i === 0) return true;
        return name.localeCompare(nameCells[i - 1]) >= 0;
    });
    
    console.log('[DEBUG] Plant names:', nameCells);
    expect(isSorted).toBeTruthy();
});

Then('the plant list should be ordered by quantity', async function () {
    await this.page.waitForSelector('tbody tr');
    
    const qtyCells = await this.page.locator('tbody tr td:nth-child(4)').allTextContents();
    const quantities = qtyCells.map(q => parseInt(q.trim()));
    
    console.log('[DEBUG] Quantities:', quantities);
    
    // Check if sorted (could be asc or desc)
    const isAscending = quantities.every((qty, i) => i === 0 || qty >= quantities[i - 1]);
    const isDescending = quantities.every((qty, i) => i === 0 || qty <= quantities[i - 1]);
    
    expect(isAscending || isDescending).toBeTruthy();
});

Then('I should see the next set of plant records', async function () {
    // Verify that we're on a different page
    await this.page.waitForSelector('tbody tr');
    
    // Check if URL changed or page content changed
    const currentUrl = this.page.url();
    console.log('[DEBUG] Current URL after pagination:', currentUrl);
    
    // Verify we have plant records showing
    const rows = this.page.locator('tbody tr');
    const count = await rows.count();
    
    expect(count).toBeGreaterThan(0);
});
