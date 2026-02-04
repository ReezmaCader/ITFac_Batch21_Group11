//Contains ALL elements and methods for Dashboard AND Category pages
const { expect } = require('@playwright/test');

class DashboardPage {
    constructor(page) {
        this.page = page;

        // Login Page Elements
        this.usernameInput = page.getByRole('textbox', { name: 'Enter your username' });
        this.passwordInput = page.getByRole('textbox', { name: 'Enter your password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });

        // Navigation Elements
        this.dashboardLink = page.getByRole('link', { name: 'Dashboard', exact: true });
        this.categoriesLink = page.getByRole('link', { name: 'Categories', exact: true });
        this.plantsLink = page.getByRole('link', { name: 'Plants', exact: true });
        this.salesLink = page.getByRole('link', { name: 'Sales', exact: true });
        this.logoutLink = page.getByRole('link', { name: 'Logout', exact: true });

        // Dashboard Summary Cards
        this.categoryCard = page.locator('.card').first();
        this.plantsCard = page.locator('div:nth-child(2) > .card');
        this.salesCard = page.locator('div:nth-child(3) > .card');

        // Category Page Elements
        this.searchInput = page.getByRole('textbox', { name: 'Search sub category' });
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.resetButton = page.getByRole('button', { name: 'Reset' });
        this.parentCategoryDropdown = page.getByRole('combobox');
        this.addCategoryButton = page.getByRole('link', { name: 'Add A Category' });

        // Category List Table Elements
        this.categoryTable = page.locator('table');
        this.categoryTableRows = page.locator('table tbody tr');
        this.idColumnHeader = page.getByRole('columnheader', { name: 'ID' });
        this.nameColumnHeader = page.getByRole('columnheader', { name: 'Name' });
        this.parentColumnHeader = page.getByRole('columnheader', { name: 'Parent' });

        // Pagination Elements
        this.nextButton = page.getByRole('button', { name: 'Next' });
        this.previousButton = page.getByRole('button', { name: 'Previous' });

        // Add/Edit Category Form Elements
        this.categoryNameInput = page.locator('#name');
        this.parentIdDropdown = page.locator('#parentId');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.cancelLink = page.getByRole('link', { name: 'Cancel' });

        // Validation Messages
        this.validationError = page.locator('.error, .alert, .invalid-feedback');

        // No Results Message
        this.noResultsMessage = page.getByText('No results found');
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

    async navigateToDashboard() {
        await this.dashboardLink.click();
    }

    async navigateToCategories() {
        await this.categoriesLink.click();
    }

    async navigateToPlants() {
        await this.plantsLink.click();
    }

    async navigateToSales() {
        await this.salesLink.click();
    }

    async navigateToAddCategory() {
        await this.addCategoryButton.click();
    }

    // Dashboard Methods
    async getCategoryCardText() {
        return await this.categoryCard.textContent();
    }

    async getPlantsCardText() {
        return await this.plantsCard.textContent();
    }

    async getSalesCardText() {
        return await this.salesCard.textContent();
    }

    async isDashboardLoaded() {
        await expect(this.categoryCard).toBeVisible();
        await expect(this.plantsCard).toBeVisible();
        await expect(this.salesCard).toBeVisible();
        return true;
    }

    async isNavigationMenuHighlighted(menuName) {
        let element;
        switch(menuName.toLowerCase()) {
            case 'dashboard':
                element = this.dashboardLink;
                break;
            case 'categories':
                element = this.categoriesLink;
                break;
            case 'plants':
                element = this.plantsLink;
                break;
            case 'sales':
                element = this.salesLink;
                break;
        }
        
        if (element) {
            const classes = await element.getAttribute('class');
            return classes && classes.includes('active');
        }
        return false;
    }

    // Category List Methods
    async searchByCategory(categoryName) {
        await this.searchInput.fill(categoryName);
        await this.searchButton.click();
    }

    async selectParentCategory(parentValue) {
        await this.parentCategoryDropdown.selectOption(parentValue);
        await this.searchButton.click();
    }

    async clickReset() {
        await this.resetButton.click();
    }

    async clickSearch() {
        await this.searchButton.click();
    }

    async getCategoryRecordCount() {
        return await this.categoryTableRows.count();
    }

    async getCategoryRecords() {
        return await this.categoryTableRows.all();
    }

    async clickNextPage() {
        await this.nextButton.click();
    }

    async clickPreviousPage() {
        await this.previousButton.click();
    }

    async isNextButtonEnabled() {
        return await this.nextButton.isEnabled();
    }

    async isPreviousButtonEnabled() {
        return await this.previousButton.isEnabled();
    }

    async sortByColumn(columnName) {
        switch(columnName.toLowerCase()) {
            case 'id':
                await this.idColumnHeader.click();
                break;
            case 'name':
                await this.nameColumnHeader.click();
                break;
            case 'parent':
                await this.parentColumnHeader.click();
                break;
        }
    }

    async getCategoryIds() {
        const rows = await this.categoryTableRows.all();
        const ids = [];
        for (const row of rows) {
            const idCell = await row.locator('td').first().textContent();
            ids.push(idCell.trim());
        }
        return ids;
    }

    async getCategoryNames() {
        const rows = await this.categoryTableRows.all();
        const names = [];
        for (const row of rows) {
            const nameCell = await row.locator('td').nth(1).textContent();
            names.push(nameCell.trim());
        }
        return names;
    }

    async getCategoryParents() {
        const rows = await this.categoryTableRows.all();
        const parents = [];
        for (const row of rows) {
            const parentCell = await row.locator('td').nth(2).textContent();
            parents.push(parentCell.trim());
        }
        return parents;
    }

    // Add/Edit Category Methods
    async enterCategoryName(name) {
        await this.categoryNameInput.fill(name);
    }

    async selectParentId(parentId) {
        await this.parentIdDropdown.selectOption(parentId);
    }

    async clickSave() {
        await this.saveButton.click();
    }

    async clickCancel() {
        await this.cancelLink.click();
    }

    async createCategory(name, parentId = null) {
        await this.enterCategoryName(name);
        if (parentId) {
            await this.selectParentId(parentId);
        }
        await this.clickSave();
    }

    async isAddCategoryButtonVisible() {
        return await this.addCategoryButton.isVisible();
    }

    async isValidationErrorVisible() {
        return await this.validationError.isVisible();
    }

    async getValidationErrorText() {
        return await this.validationError.textContent();
    }

    // Edit and Delete Actions
    async clickEditForRow(rowIndex) {
        const editButton = this.categoryTableRows.nth(rowIndex).getByTitle('Edit');
        await editButton.click();
    }

    async clickDeleteForRow(rowIndex) {
        const deleteButton = this.categoryTableRows.nth(rowIndex).getByRole('button');
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

    async isEditButtonVisible() {
        const editButtons = this.page.getByTitle('Edit');
        const count = await editButtons.count();
        return count > 0;
    }

    async isDeleteButtonVisible() {
        const deleteButtons = this.categoryTableRows.first().getByRole('button');
        try {
            return await deleteButtons.isVisible();
        } catch {
            return false;
        }
    }

    // Utility Methods
    async isNoResultsMessageVisible() {
        try {
            return await this.noResultsMessage.isVisible();
        } catch {
            return false;
        }
    }

    async getCurrentUrl() {
        return this.page.url();
    }

    async waitForCategoryPage() {
        await this.page.waitForURL('**/categories');
    }

    async waitForDashboardPage() {
        await this.page.waitForURL('**/dashboard');
    }
}

module.exports = { DashboardPage };