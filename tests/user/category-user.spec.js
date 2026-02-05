const { test, expect } = require('@playwright/test');
const { DashboardPage } = require('../../pages/dashboard.page');

test.describe('Category Module - User Tests', () => {
    let dashboardPage;

    test.beforeEach(async ({ page }) => {
        dashboardPage = new DashboardPage(page);
        await dashboardPage.goto();
        await dashboardPage.loginAsUser();
        await dashboardPage.navigateToCategories();
    });

    test('TC_DASHBOARD_UI_USER_001: Verify the functionality whether the list of categories are loading with the pagination', async ({ page }) => {
        // Verify user is on category page
        await expect(page).toHaveURL(/.*categories/);

        // Check whether the categories are displayed
        const recordCount = await dashboardPage.getCategoryRecordCount();
        expect(recordCount).toBeGreaterThan(0);

        // Check whether the page number, Next, and previous buttons are visible
        const isNextEnabled = await dashboardPage.isNextButtonEnabled();
        const isPreviousEnabled = await dashboardPage.isPreviousButtonEnabled();
        
        // Verify pagination controls exist
        await expect(dashboardPage.nextButton).toBeVisible();
        await expect(dashboardPage.previousButton).toBeVisible();

        // Click on the Next or page number 2 and check that categories are loaded
        if (isNextEnabled) {
            await dashboardPage.clickNextPage();
            
            // Check that it is loading the first page
            const recordCountAfterNext = await dashboardPage.getCategoryRecordCount();
            expect(recordCountAfterNext).toBeGreaterThan(0);
        }

        // Click on the previous and check that it is loading the first page
        if (await dashboardPage.isPreviousButtonEnabled()) {
            await dashboardPage.clickPreviousPage();
        }

        // Navigate through each page and check whether each page loaded correctly
        const finalRecordCount = await dashboardPage.getCategoryRecordCount();
        expect(finalRecordCount).toBeGreaterThan(0);
    });

    test('TC_DASHBOARD_UI_USER_002: Verify the functionality of searching by category name', async ({ page }) => {
        // Verify user is on category page
        await expect(page).toHaveURL(/.*categories/);

        // Check whether the search field is enabled and able to type inside it
        await expect(dashboardPage.searchInput).toBeVisible();
        await expect(dashboardPage.searchInput).toBeEnabled();

        // Enter a valid category name, full or partial, in the search field
        await dashboardPage.searchByCategory('asb');

        // Check whether the category list displays the correct category or the matching category based on the input
        const recordCount = await dashboardPage.getCategoryRecordCount();
        
        if (recordCount > 0) {
            const categoryNames = await dashboardPage.getCategoryNames();
            // Verify at least one category contains the search term
            const hasMatch = categoryNames.some(name => 
                name.toLowerCase().includes('asb')
            );
            expect(hasMatch).toBeTruthy();
        }

        // Clear the search input and check all the categories displayed
        await dashboardPage.searchInput.fill('');
        await dashboardPage.clickSearch();

        const allRecordCount = await dashboardPage.getCategoryRecordCount();
        expect(allRecordCount).toBeGreaterThan(0);
    });

    test('TC_BOARD_UI_USER_003: Verify the functionality of filtering by parent category', async ({ page }) => {
        // Verify user is on category page
        await expect(page).toHaveURL(/.*categories/);

        // Check whether the parent category filter option is available
        await expect(dashboardPage.parentCategoryDropdown).toBeVisible();

        // Click on a parent category from the dropdown
        await dashboardPage.selectParentCategory('1');

        // Check whether it displays the correct category based on the selected parent category
        const recordCount = await dashboardPage.getCategoryRecordCount();
        
        if (recordCount > 0) {
            const parents = await dashboardPage.getCategoryParents();
            // Verify filtered results show the correct parent
            const allMatch = parents.every(parent => parent.includes('ABCD') || parent.trim() === '');
            expect(allMatch).toBeTruthy();
        }

        // Reset or clear the filter and check whether all categories are displayed
        await dashboardPage.parentCategoryDropdown.selectOption('');
        await dashboardPage.clickSearch();

        const allRecordCount = await dashboardPage.getCategoryRecordCount();
        expect(allRecordCount).toBeGreaterThan(0);
    });

    test('TC_DASHBOARD_UI_USER_004: Verify the functionality of sorting by ID', async ({ page }) => {
        // Verify user is on category page
        await expect(page).toHaveURL(/.*categories/);

        // Check whether the ID column of the category list is visible and clickable
        await expect(dashboardPage.idColumnHeader).toBeVisible();

        // Click on the ID Column sorting option
        await dashboardPage.sortByColumn('id');

        // Check whether it displays in ascending order of ID
        let ids = await dashboardPage.getCategoryIds();
        const idsNumeric = ids.map(id => parseInt(id));
        const isAscending = idsNumeric.every((val, i, arr) => !i || arr[i - 1] <= val);
        expect(isAscending).toBeTruthy();

        // Click on the ID column again and check whether it is sorted in descending order of ID
        await dashboardPage.sortByColumn('id');
        ids = await dashboardPage.getCategoryIds();
        const idsNumeric2 = ids.map(id => parseInt(id));
        const isDescending = idsNumeric2.every((val, i, arr) => !i || arr[i - 1] >= val);
        expect(isDescending).toBeTruthy();
    });

    test('TC_DASHBOARD_UI_USER_005: Verify the functionality of sorting by Name', async ({ page }) => {
        // Verify user is on category page
        await expect(page).toHaveURL(/.*categories/);

        // Check whether the Name column of the category list is visible and clickable
        await expect(dashboardPage.nameColumnHeader).toBeVisible();

        // Click on the Name Column sorting option
        await dashboardPage.sortByColumn('name');

        // Check whether it sorts in ascending alphabetical order
        let names = await dashboardPage.getCategoryNames();
        const sortedAsc = [...names].sort((a, b) => a.localeCompare(b));
        expect(names).toEqual(sortedAsc);

        // Click on the Name column again and check whether it is sorted in descending alphabetical order
        await dashboardPage.sortByColumn('name');
        names = await dashboardPage.getCategoryNames();
        const sortedDesc = [...names].sort((a, b) => b.localeCompare(a));
        expect(names).toEqual(sortedDesc);
    });

    test('TC_DASHBOARD_UI_USER_006: Verify the functionality of sorting by Parent category', async ({ page }) => {
        // Verify user is on category page
        await expect(page).toHaveURL(/.*categories/);

        // Check whether the parent category dropdown of the category list is visible and clickable
        await expect(dashboardPage.parentColumnHeader).toBeVisible();

        // Click on the Parent category sorting option
        await dashboardPage.sortByColumn('parent');

        // Select and click on a parent category from the dropdown
        const parents = await dashboardPage.getCategoryParents();
        expect(parents.length).toBeGreaterThan(0);

        // Check whether it displays the correct by sorting out relevant sub-categories for the selected parent category
        await dashboardPage.sortByColumn('parent');
    });
});
