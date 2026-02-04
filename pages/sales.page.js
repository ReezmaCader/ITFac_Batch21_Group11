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

        // Validation Messages
        this.plantRequiredError = page.getByText('Plant is required');
        this.quantityError = page.getByText('Quantity must be greater than 0');

        // Table Headers
        this.plantNameHeader = page.getByRole('columnheader', { name: 'Plant name' });
        this.quantityHeader = page.getByRole('columnheader', { name: 'Quantity' });
        this.totalPriceHeader = page.getByRole('columnheader', { name: 'Total price' });
        this.soldDateHeader = page.getByRole('columnheader', { name: 'Sold date' });
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
        const optionTexts = [];
        for (const option of options) {
            const text = await option.textContent();
            optionTexts.push(text);
        }
        return optionTexts;
    }

    async isPlantRequiredErrorVisible() {
        return await this.plantRequiredError.isVisible();
    }

    async isQuantityErrorVisible() {
        return await this.quantityError.isVisible();
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
        await this.page.waitForURL('**/sell-plant');
    }
}

module.exports = { SalesPage };
