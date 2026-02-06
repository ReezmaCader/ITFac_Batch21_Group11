const { expect } = require('@playwright/test');

class CategoryPage {
    constructor(page) {
        this.page = page;

        // Buttons
        this.addCategoryButton = 'a.btn-primary[href="/ui/categories/add"]';

        // Table elements
        this.categoriesTable = 'table.table';
        this.tableHeaders = 'thead th';
        this.tableRows = 'tbody tr';

        // Search form
        this.searchInput = 'input[name="name"]';
        this.parentFilter = 'select[name="parentId"]';
        this.searchButton = 'button.btn-primary[type="submit"]';
        this.resetButton = 'a.btn-outline-secondary';

        // Action buttons
        this.editButtons = 'a.btn-outline-primary[title="Edit"]';
        this.deleteButtons = 'button.btn-outline-danger[title="Delete"]';

        // Page elements
        this.pageHeader = 'h3.mb-4';
    }

    async navigateTo() {
        await this.page.click('.sidebar a[href="/ui/categories"]');
        await this.page.waitForLoadState('networkidle');
    }

    async verifyOnPage() {
        await expect(this.page).toHaveURL(/.*\/ui\/categories/);
    }

    async verifyHeader(headerText) {
        await expect(this.page.locator(this.pageHeader)).toHaveText(headerText);
    }

    async searchCategory(categoryName) {
        await this.page.fill(this.searchInput, categoryName);
        await this.page.click(this.searchButton);
        await this.page.waitForLoadState('networkidle');
    }

    async verifyNoResultsMessage(message) {
        const tableBody = this.page.locator('tbody');
        await expect(tableBody).toContainText(message);
    }

    async verifyAddButtonHidden() {
        const addButton = this.page.locator(this.addCategoryButton);
        const count = await addButton.count();

        if (count > 0) {
            await expect(addButton).toBeHidden();
        } else {
            expect(count).toBe(0);
        }
    }

    async verifyEditButtonsDisabled() {
        const buttons = this.page.locator(this.editButtons);
        const count = await buttons.count();

        if (count > 0) {
            for (let i = 0; i < count; i++) {
                await expect(buttons.nth(i)).toBeDisabled();
            }
        }
    }

    async verifyDeleteButtonsDisabled() {
        const buttons = this.page.locator(this.deleteButtons);
        const count = await buttons.count();

        if (count > 0) {
            for (let i = 0; i < count; i++) {
                await expect(buttons.nth(i)).toBeDisabled();
            }
        }
    }

    async verifyEditButtonsDisabled() {
        const buttons = this.page.locator(this.editButtons);
        const count = await buttons.count();

        for (let i = 0; i < count; i++) {
            const button = buttons.nth(i);
            const isDisabled = await button.getAttribute('disabled');
            const isVisible = await button.isVisible();

            expect(isDisabled).toBe('disabled');
            expect(isVisible).toBe(false);
        }
    }

    async verifyDeleteButtonsDisabled() {
        const buttons = this.page.locator(this.deleteButtons);
        const count = await buttons.count();

        for (let i = 0; i < count; i++) {
            const button = buttons.nth(i);
            const isDisabled = await button.getAttribute('disabled');
            const isVisible = await button.isVisible();

            expect(isDisabled).toBe('disabled');
            expect(isVisible).toBe(false);
        }
    }
}

module.exports = { CategoryPage };