const { expect } = require('@playwright/test');

class PlantPage {
    constructor(page) {
        this.page = page;
        
        // Buttons
        this.addPlantButton = 'a.btn-primary[href="/ui/plants/add"]';
        
        // Table elements
        this.plantsTable = 'table.table';
        this.tableHeaders = 'thead th';
        this.tableRows = 'tbody tr';
        
        // Search and filter
        this.searchInput = 'input[name="name"]';
        this.categoryFilter = 'select[name="categoryId"]';
        this.searchButton = 'button.btn-primary[type="submit"]';
        
        // Sorting
        this.sortByName = 'th:has-text("Name")';
        this.sortByPrice = 'th:has-text("Price")';
        this.sortByQuantity = 'th:has-text("Quantity")';
        
        // Action buttons
        this.editButtons = 'a.btn-outline-primary[title="Edit"]';
        this.deleteButtons = 'button.btn-outline-danger[title="Delete"]';
        this.sellButtons = 'button.btn-success[title="Sell"]';
        
        // Badges
        this.lowStockBadge = '.badge.bg-danger:has-text("Low")';
        
        // Pagination
        this.paginationNext = '.pagination a:has-text("Next")';
        this.paginationPrev = '.pagination a:has-text("Previous")';
        
        // Page elements
        this.pageHeader = 'h3.mb-4';
    }

    async navigateTo() {
        await this.page.goto('http://localhost:8080/ui/plants');
        await this.page.waitForLoadState('networkidle');
    }

    async verifyOnPage() {
        await expect(this.page).toHaveURL(/.*\/ui\/plants/);
    }

    async verifyHeader(headerText) {
        await expect(this.page.locator(this.pageHeader)).toHaveText(headerText);
    }

    async clickAddPlant() {
        await this.page.click(this.addPlantButton);
        await this.page.waitForLoadState('networkidle');
    }

    async searchPlant(plantName) {
        await this.page.fill(this.searchInput, plantName);
        await this.page.click(this.searchButton);
        await this.page.waitForLoadState('networkidle');
    }

    async sortBy(field) {
        if (field === 'Name') {
            await this.page.click(this.sortByName);
        } else if (field === 'Price') {
            await this.page.click(this.sortByPrice);
        } else if (field === 'Quantity') {
            await this.page.click(this.sortByQuantity);
        }
        
        await this.page.waitForLoadState('networkidle');
    }

    async verifyLowStockBadge() {
        const badge = this.page.locator(this.lowStockBadge);
        await expect(badge.first()).toBeVisible();
    }

    async verifyNoLowStockBadge() {
        const badge = this.page.locator(this.lowStockBadge);
        const count = await badge.count();
        expect(count).toBe(0);
    }

    async clickNextPage() {
        await this.page.click(this.paginationNext);
        await this.page.waitForLoadState('networkidle');
    }

    async verifyAddButtonHidden() {
        const addButton = this.page.locator(this.addPlantButton);
        const count = await addButton.count();
        
        if (count > 0) {
            await expect(addButton).toBeHidden();
        } else {
            expect(count).toBe(0);
        }
    }
}

class PlantFormPage {
    constructor(page) {
        this.page = page;
        
        // Form fields
        this.nameInput = 'input#name';
        this.categorySelect = 'select#categoryId';
        this.priceInput = 'input#price';
        this.quantityInput = 'input#quantity';
        
        // Buttons
        this.saveButton = 'button[type="submit"]';
        this.cancelButton = 'a[href="/ui/plants"]';
        
        // Validation
        this.validationErrors = '.invalid-feedback';
    }

    async fillName(name) {
        await this.page.fill(this.nameInput, name);
    }

    async selectCategory(categoryName) {
        await this.page.selectOption(this.categorySelect, { label: categoryName });
    }

    async fillPrice(price) {
        await this.page.fill(this.priceInput, price.toString());
    }

    async fillQuantity(quantity) {
        await this.page.fill(this.quantityInput, quantity.toString());
    }

    async clickSave() {
        await this.page.click(this.saveButton);
        await this.page.waitForLoadState('networkidle');
    }

    async clickCancel() {
        await this.page.click(this.cancelButton);
        await this.page.waitForLoadState('networkidle');
    }

    async verifyValidationError(errorMessage) {
        const error = this.page.locator(this.validationErrors);
        await expect(error.first()).toBeVisible();
        const text = await error.first().textContent();
        expect(text.toLowerCase()).toContain(errorMessage.toLowerCase());
    }
}

module.exports = { PlantPage, PlantFormPage };
