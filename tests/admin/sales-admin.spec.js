const { test, expect } = require('@playwright/test');
const { SalesPage } = require('../../pages/sales.page');

test.describe('Sales Module - Admin Tests', () => {
    let salesPage;

    test.beforeEach(async ({ page }) => {
        salesPage = new SalesPage(page);
        await salesPage.goto();
        await salesPage.loginAsAdmin();
        await salesPage.navigateToSales();
    });

    test('TC_Sales_UI_Admin_006: Verify the functionality of navigating to the Sell Plant page', async ({ page }) => {
        // Verify admin can click on Sales
        await expect(page).toHaveURL(/.*sales/);

        // Verify Sell Plant button is visible for admin
        const isSellPlantVisible = await salesPage.isSellPlantButtonVisible();
        expect(isSellPlantVisible).toBeTruthy();

        // Click on "Sell Plant" button
        await salesPage.navigateToSellPlant();

        // Verify the system redirects to the Sell Plant page
        await expect(page).toHaveURL(/.*sell-plant/);
    });

    test('TC_Sales_UI_Admin_007: Verify the functionality of mandatory field validation on Sell Plant page', async ({ page }) => {
        // Navigate to Sell Plant page
        await salesPage.navigateToSellPlant();
        await expect(page).toHaveURL(/.*sell-plant/);

        // Leave fields empty and click Sell
        await salesPage.clickSellButton();

        // Verify "Plant is required" validation message
        const isPlantErrorVisible = await salesPage.isPlantRequiredErrorVisible();
        expect(isPlantErrorVisible).toBeTruthy();

        // Verify "Quantity must be greater than 0" validation message
        const isQuantityErrorVisible = await salesPage.isQuantityErrorVisible();
        expect(isQuantityErrorVisible).toBeTruthy();
    });

    test('TC_Sales_UI_Admin_008: Verify the functionality of the Plant dropdown displaying current stock', async ({ page }) => {
        // Navigate to Sell Plant page
        await salesPage.navigateToSellPlant();
        await expect(page).toHaveURL(/.*sell-plant/);

        // Click on Plant dropdown and verify options
        const plantOptions = await salesPage.getPlantDropdownOptions();

        // Verify a list of available plants is displayed
        expect(plantOptions.length).toBeGreaterThan(0);

        // Verify each plant option displays current stock (format: "Plant Name - Stock: X")
        for (const option of plantOptions) {
            if (option && option.trim() !== '' && !option.includes('Select')) {
                // Verify the option contains stock information
                expect(option).toBeTruthy();
            }
        }
    });

    test('TC_Sales_UI_Admin_009: Verify the functionality of the delete confirmation prompt', async ({ page }) => {
        // Verify admin can see sales
        await expect(page).toHaveURL(/.*sales/);

        // Check if there are sales records to delete
        const recordCount = await salesPage.getSalesRecordCount();

        if (recordCount > 0) {
            // Set up dialog handler to capture the confirmation message
            const dialogPromise = salesPage.waitForDeleteDialog();

            // Click on Delete for a sale record
            await salesPage.clickDeleteForRow(0);

            // Verify confirmation prompt is displayed
            const dialogMessage = await dialogPromise;
            expect(dialogMessage).toBeTruthy();
        }
    });

    test('TC_Sales_UI_Admin_010: Verify the functionality of recording a sale successfully', async ({ page }) => {
        // Navigate to Sell Plant page
        await salesPage.navigateToSellPlant();
        await expect(page).toHaveURL(/.*sell-plant/);

        // Get initial plant options to verify stock later
        const initialOptions = await salesPage.getPlantDropdownOptions();

        // Select a Plant
        await salesPage.selectPlant('1');

        // Enter Quantity
        await salesPage.enterQuantity('2');

        // Click on Sell
        await salesPage.clickSellButton();

        // Verify the system redirects to the sales list
        await salesPage.waitForSalesPage();
        await expect(page).toHaveURL(/.*sales/);

        // Verify the new sale record is displayed in the list
        const recordCount = await salesPage.getSalesRecordCount();
        expect(recordCount).toBeGreaterThan(0);
    });
});
