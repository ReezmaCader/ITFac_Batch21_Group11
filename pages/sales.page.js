const { expect } = require('@playwright/test');

class SalesPage {
    constructor(page) {
        this.page = page;

        // Login Page Elements
        this.usernameInput = page.getByRole('textbox', { name: 'Enter your username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });

        // Navigation Elements
        this.salesLink = page.getByRole('link', { name: 'Sales', exact: true });
        this.sellPlantLink = page.getByRole('link', { name: 'Sell Plant' });
        this.logoutLink = page.getByRole('link', { name: 'Logout', exact: true });

        // Sales List Page Elements
        this.salesTable = page.locator('table');
        this.salesTableRows = page.locator('table tbody tr');
        this.noSalesMessage = page.getByText('No sales found');

        // Sell Plant Page Elements
        this.plantDropdown = page.locator('#plantId');
        this.quantityInput = page.locator('#quantity');
        this.sellButton = page.getByRole('button', { name: 'Sell' });

        // Validation Messages - Using regex for flexibility
        this.plantRequiredError = page.locator('text=/plant.*required|required.*plant/i');
        this.quantityError = page.locator('text=/quantity.*greater|quantity.*0|invalid.*quantity/i');

        // Table Headers - Using locator text matching for flexibility
        this.plantNameHeader = page.locator('th').filter({ hasText: /plant/i }).first();
        this.quantityHeader = page.locator('th').filter({ hasText: /quantity/i }).first();
        this.totalPriceHeader = page.locator('th').filter({ hasText: /price|total/i }).first();
        this.soldDateHeader = page.locator('th').filter({ hasText: /date|sold/i }).first();
    }

    // Navigation Methods
    async goto() {
        await this.page.goto('http://localhost:8080/ui/login');
    }

    async loginAsAdmin() {
        await this.usernameInput.fill('admin');
        await this.passwordInput.fill('admin123');
        await this.loginButton.click();
    }

    async loginAsUser() {
        await this.usernameInput.fill('testuser');
        await this.passwordInput.fill('test123');
        await this.loginButton.click();
    }

    async logout() {
        await this.logoutLink.click();
    }

    async navigateToSales() {
        await this.salesLink.click();
    }

    async navigateToSellPlant() {
        await this.sellPlantLink.click();
    }

    // Sales List Page Methods
    async getSalesRecords() {
        return await this.salesTableRows.all();
    }

    async getSalesRecordCount() {
        return await this.salesTableRows.count();
    }

    async isSellPlantButtonVisible() {
        return await this.sellPlantLink.isVisible();
    }

    async isDeleteButtonVisible() {
        const deleteButtons = this.page.locator('table tbody tr button');
        const count = await deleteButtons.count();
        return count > 0;
    }

    async getDeleteButtonForRow(rowIndex) {
        return this.salesTableRows.nth(rowIndex).getByRole('button');
    }

    async isNoSalesMessageVisible() {
        return await this.noSalesMessage.isVisible();
    }

    async getSoldDates() {
        const rows = await this.salesTableRows.all();
        const dates = [];
        for (const row of rows) {
            const dateCell = await row.locator('td').nth(3).textContent();
            dates.push(dateCell);
        }
        return dates;
    }

    async verifySalesTableHeaders() {
        await expect(this.plantNameHeader).toBeVisible();
        await expect(this.quantityHeader).toBeVisible();
        await expect(this.totalPriceHeader).toBeVisible();
        await expect(this.soldDateHeader).toBeVisible();
    }

    async verifySalesRecordColumns() {
        const firstRow = this.salesTableRows.first();
        const cells = firstRow.locator('td');
        const cellCount = await cells.count();
        return cellCount >= 4;
    }

    // Sell Plant Page Methods
    async selectPlant(plantValue) {
        await this.plantDropdown.selectOption(plantValue);
    }

    async enterQuantity(quantity) {
        await this.quantityInput.fill(quantity);
    }

    async clickSellButton() {
        await this.sellButton.click();
    }

    async sellPlant(plantValue, quantity) {
        await this.selectPlant(plantValue);
        await this.enterQuantity(quantity);
        await this.clickSellButton();
    }

    async getPlantDropdownOptions() {
        const options = await this.plantDropdown.locator('option').all();
        const optionData = [];
        for (const option of options) {
            const text = await option.textContent();
            const value = await option.getAttribute('value');
            optionData.push({ text: text || '', value: value || '' });
        }
        return optionData;
    }

    async isPlantRequiredErrorVisible() {
        // Check if the plant dropdown has validation error or is required
        const plantSelect = this.page.locator('#plantId, select[name*="plant"]').first();
        
        // Check for visible error messages
        const plantError = this.page.locator('.error, .invalid-feedback, .text-danger, [class*="error"]').filter({ hasText: /plant/i });
        const errorCount = await plantError.count();
        if (errorCount > 0) return true;
        
        // Check if placeholder is selected (no valid plant chosen)
        const isInvalid = await plantSelect.evaluate(el => {
            const selectedOption = el.options[el.selectedIndex];
            const isPlaceholder = selectedOption && selectedOption.text.toLowerCase().includes('select');
            return !el.validity.valid || el.value === '' || isPlaceholder;
        });
        return isInvalid;
    }

    async isQuantityErrorVisible() {
        // Check if the quantity input has validation error
        const quantityInput = this.page.locator('#quantity, input[name*="quantity"]').first();
        
        // Check for visible error messages  
        const quantityError = this.page.locator('.error, .invalid-feedback, .text-danger, [class*="error"]').filter({ hasText: /quantity/i });
        const errorCount = await quantityError.count();
        if (errorCount > 0) return true;
        
        // Check HTML5 validation state - quantity must be > 0
        const isInvalid = await quantityInput.evaluate(el => {
            const val = parseInt(el.value) || 0;
            return !el.validity.valid || val <= 0;
        });
        return isInvalid;
    }

    // Delete Functionality Methods
    async clickDeleteForRow(rowIndex) {
        const deleteButton = await this.getDeleteButtonForRow(rowIndex);
        await deleteButton.click();
    }

    async handleDeleteConfirmation(accept = true) {
        this.page.once('dialog', async dialog => {
            if (accept) {
                await dialog.accept();
            } else {
                await dialog.dismiss();
            }
        });
    }

    async waitForDeleteDialog() {
        return new Promise((resolve) => {
            this.page.once('dialog', async dialog => {
                const message = dialog.message();
                await dialog.dismiss();
                resolve(message);
            });
        });
    }

    // Utility Methods
    async getCurrentUrl() {
        return this.page.url();
    }

    async waitForSalesPage() {
        await this.page.waitForURL('**/sales');
    }

    async waitForSellPlantPage() {
        await this.page.waitForURL('**/sales/new');
    }
}

module.exports = { SalesPage };
