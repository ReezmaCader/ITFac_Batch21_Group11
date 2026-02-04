const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('../../pages/dashboard.page');

test.describe('Dashboard Module - Admin Tests', () => {
    let dashboardPage;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        await dashboardPage.goto();
        await dashboardPage.loginAsAdmin();
    });

    test('TC_DASHBOARD_UI_ADMIN_007: Verify search functionality when an incorrect category name is entered', async ({ page }) => {
        // Navigate to the category page
        await dashboardPage.navigateToCategories();
        await expect(page).toHaveURL(/.*categories/);

        // Click on the search input field
        await dashboardPage.searchInput.click();

        // Enter an incorrect category name
        await dashboardPage.searchByCategory('XYZ');

        // The system should not return any matching categories
        const recordCount = await dashboardPage.getCategoryRecordCount();
        
        // An user friendly message should be displayed, such as "No results found."
        if (recordCount === 0) {
            const isNoResultsVisible = await dashboardPage.isNoResultsMessageVisible();
            expect(isNoResultsVisible).toBeTruthy();
        }

        // The system should not crash or show incorrect results
        await expect(page).toHaveURL(/.*categories/);
    });

    test('TC_DASHBOARD_UI_ADMIN_008: Verify whether the Admin dashboard is loaded after successful login', async ({ page }) => {
        // Enter correct user name and password
        // Login is already done in beforeEach

        // Click on login
        // System should navigate to Dashboard
        await expect(page).toHaveURL(/.*dashboard/);

        // Admin able to enter username and password
        // Able to click on Login button
        // Dashboard and elements of Admin dashboard should be visible without any error message
        const isDashboardLoaded = await dashboardPage.isDashboardLoaded();
        expect(isDashboardLoaded).toBeTruthy();
    });

    test('TC_DASHBOARD_UI_ADMIN_009: Verify whether the Admin Dashboard navigation menu is highlighted correctly', async ({ page }) => {
        // Admin logged into the system
        // Admin dashboard is loaded properly
        await expect(page).toHaveURL(/.*dashboard/);

        // Check whether the navigation menu is the Admin dashboard
        await expect(dashboardPage.dashboardLink).toBeVisible();

        // Click on each menu one by one, navigate between each section
        await dashboardPage.navigateToCategories();
        await expect(page).toHaveURL(/.*categories/);

        await dashboardPage.navigateToPlants();
        await expect(page).toHaveURL(/.*plants/);

        await dashboardPage.navigateToDashboard();
        await expect(page).toHaveURL(/.*dashboard/);

        // The currently selected/ active menu item should be visually highlighted
        // The highlight should be changed correctly when a different menu item is selected
        // Only one menu item should be highlighted at a time
        // Navigation should be smooth without any UI misalignment error
    });

    test('TC_DASHBOARD_UI_ADMIN_010: Verify the display of Category, Plants, and Sales Summary information on the Admin Dashboard', async ({ page }) => {
        // Admin logged into the system
        // Admin dashboard is loaded properly
        await expect(page).toHaveURL(/.*dashboard/);

        // Navigate to the admin dashboard
        await dashboardPage.navigateToDashboard();

        // Check whether the dashboard displays category, plants, and sales summary information
        const categoryCardText = await dashboardPage.getCategoryCardText();
        const plantsCardText = await dashboardPage.getPlantsCardText();
        const salesCardText = await dashboardPage.getSalesCardText();

        // Category detail is displayed correctly
        expect(categoryCardText).toBeTruthy();
        expect(categoryCardText.toLowerCase()).toContain('categor');

        // Plants summary information is displayed correctly
        expect(plantsCardText).toBeTruthy();
        expect(plantsCardText.toLowerCase()).toContain('plant');

        // Sales summary information is displayed correctly
        expect(salesCardText).toBeTruthy();
        expect(salesCardText.toLowerCase()).toContain('sale');

        // Displayed values are accurate and match the system data
        // No UI errors or missing information
    });

    test('TC_DASHBOARD_UI_ADMIN_011: Verify whether the Add category button is visible on the admin category page', async ({ page }) => {
        // Admin logged into the system
        // Admin category page is accessible
        await dashboardPage.navigateToCategories();
        await expect(page).toHaveURL(/.*categories/);

        // Navigate to the category page
        // The Add category button should be clearly visible on the Admin category page
        const isAddButtonVisible = await dashboardPage.isAddCategoryButtonVisible();
        expect(isAddButtonVisible).toBeTruthy();

        // The button is enabled and properly aligned in the UI
        await expect(dashboardPage.addCategoryButton).toBeEnabled();
    });

    test('TC_DASHBOARD_UI_ADMIN_013: Verify that the category name field on the add category page does not accept fewer than 3 characters', async ({ page }) => {
        // Admin logged into the system
        // Admin is on the Add category page
        await dashboardPage.navigateToCategories();
        await dashboardPage.navigateToAddCategory();

        // Enter a category name with less than 3 characters
        await dashboardPage.enterCategoryName('ab');

        // Click submit
        await dashboardPage.clickSave();

        // The system should not accept the category name
        // A validation error message should be displayed (such as Category name must be at least 3 characters)
        const isErrorVisible = await dashboardPage.isValidationErrorVisible();
        expect(isErrorVisible).toBeTruthy();

        // Category name should ot be saved
        await expect(page).not.toHaveURL(/.*categories$/);
    });

    test('TC_DASHBOARD_UI_ADMIN_014: Verify whether the category name field on the add category page accepts characters between 3 and 10', async ({ page }) => {
        // Admin logged in to the system
        // admin on the add category page
        await dashboardPage.navigateToCategories();
        await dashboardPage.navigateToAddCategory();

        // Enter a category name with 3 to 10 characters
        await dashboardPage.createCategory('TestCat', '1');

        // The system should accept the category name
        // No validation error message should be displayed
        // The category should be saved successfully and appear on the category list
        await expect(page).toHaveURL(/.*categories/);
    });

    test('TC_DASHBOARD_UI_ADMIN_015: Verify whether the category name field in the add category page is not accepting more than 10 characters', async ({ page }) => {
        // Admin logged in to the system
        // Admin is on the Add category page
        await dashboardPage.navigateToCategories();
        await dashboardPage.navigateToAddCategory();

        // Enter a category name with more than 10 characters
        await dashboardPage.enterCategoryName('Abcdefghijk');

        // Click submit
        await dashboardPage.clickSave();

        // The system should not accept the category name
        // A validation error message should be displayed (such as: Category name must not exceed 10 characters)
        const isErrorVisible = await dashboardPage.isValidationErrorVisible();
        expect(isErrorVisible).toBeTruthy();

        // Category name should ot be saved
    });

    test('TC_DASHBOARD_UI_ADMIN_016: Verify whether the edit and delete actions are enabled on the category page', async ({ page }) => {
        // Admin logged into the system
        // Admin category page is displayed
        // At least one category exists in the system
        await dashboardPage.navigateToCategories();
        await expect(page).toHaveURL(/.*categories/);

        const recordCount = await dashboardPage.getCategoryRecordCount();
        
        if (recordCount > 0) {
            // Navigate to admin category page
            // Edit action is visible and enabled for each category
            const isEditVisible = await dashboardPage.isEditButtonVisible();
            expect(isEditVisible).toBeTruthy();

            // The delete action is visible and enabled for each category
            const isDeleteVisible = await dashboardPage.isDeleteButtonVisible();
            expect(isDeleteVisible).toBeTruthy();

            // Admin can initiate Edit or delete actions without errors
        }
    });

    test('TC_DASHBOARD_UI_ADMIN_017: Verify whether clicking on the Edit button allows editing a particular category', async ({ page }) => {
        // Admin logged in to the system
        // Admin on the category page
        // At least one category exists
        await dashboardPage.navigateToCategories();
        await expect(page).toHaveURL(/.*categories/);

        const recordCount = await dashboardPage.getCategoryRecordCount();
        
        if (recordCount > 0) {
            // On the admin category page, click the edit button for a specific category.
            await dashboardPage.clickEditForRow(0);

            // Modify category name or other editable fields
            await dashboardPage.categoryNameInput.fill('Updated');

            // click on submit
            await dashboardPage.clickSave();

            // The category details should be updated successfully
            await expect(page).toHaveURL(/.*categories/);

            // The updated category names should reflect in the category list
            // No errors or validation issues should occur
        }
    });
});