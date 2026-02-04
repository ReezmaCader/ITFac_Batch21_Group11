const { test, expect } = require('@playwright/test');
const { SalesPage } = require('../../pages/sales.page');

test.describe('Sales Module - User Tests', () => {
    let salesPage;

    test.beforeEach(async ({ page }) => {
        salesPage = new SalesPage(page);
        await salesPage.goto();
        await salesPage.loginAsUser();
        await salesPage.navigateToSales();
    });

    test('TC_Sales_UI_User_001: Verify the functionality of the Sales List page displaying records correctly', async ({ page }) => {
        // Verify user can click on Sales
        await expect(page).toHaveURL(/.*sales/);

        // Verify table headers are displayed
        await salesPage.verifySalesTableHeaders();

        // Verify records display Plant name, Quantity, Total price, and Sold date
        const recordCount = await salesPage.getSalesRecordCount();
        
        if (recordCount > 0) {
            const hasCorrectColumns = await salesPage.verifySalesRecordColumns();
            expect(hasCorrectColumns).toBeTruthy();

            // Verify first row has all required data
            const firstRow = salesPage.salesTableRows.first();
            const cells = firstRow.locator('td');
            
            // Plant name
            const plantName = await cells.nth(0).textContent();
            expect(plantName).toBeTruthy();

            // Quantity
            const quantity = await cells.nth(1).textContent();
            expect(quantity).toBeTruthy();

            // Total price
            const totalPrice = await cells.nth(2).textContent();
            expect(totalPrice).toBeTruthy();

            // Sold date
            const soldDate = await cells.nth(3).textContent();
            expect(soldDate).toBeTruthy();
        }
    });

    test('TC_Sales_UI_User_002: Verify the functionality of the default sorting by sold date', async ({ page }) => {
        // Verify user can click on Sales
        await expect(page).toHaveURL(/.*sales/);

        // Get sold dates and verify they are in descending order
        const soldDates = await salesPage.getSoldDates();

        if (soldDates.length > 1) {
            // Verify dates are sorted in descending order (newest first)
            for (let i = 0; i < soldDates.length - 1; i++) {
                const currentDate = new Date(soldDates[i]);
                const nextDate = new Date(soldDates[i + 1]);
                expect(currentDate.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
            }
        }
    });

    test('TC_Sales_UI_User_003: Verify the functionality of the "Sell Plant" button being hidden for User', async ({ page }) => {
        // Verify user can click on Sales
        await expect(page).toHaveURL(/.*sales/);

        // Verify the "Sell Plant" button is hidden for User role
        const isSellPlantVisible = await salesPage.isSellPlantButtonVisible();
        expect(isSellPlantVisible).toBeFalsy();
    });

    test('TC_Sales_UI_User_004: Verify the functionality of the "Delete" action being hidden for User', async ({ page }) => {
        // Verify user can click on Sales
        await expect(page).toHaveURL(/.*sales/);

        // Verify the "Delete" action is hidden for User role
        const isDeleteVisible = await salesPage.isDeleteButtonVisible();
        expect(isDeleteVisible).toBeFalsy();
    });

    test('TC_Sales_UI_User_005: Verify the functionality of displaying an appropriate message when no sales exist', async ({ page }) => {
        // Verify user can click on Sales
        await expect(page).toHaveURL(/.*sales/);

        // Check if no sales exist
        const recordCount = await salesPage.getSalesRecordCount();

        if (recordCount === 0) {
            // Verify "No sales found" message is displayed
            const isNoSalesMessageVisible = await salesPage.isNoSalesMessageVisible();
            expect(isNoSalesMessageVisible).toBeTruthy();
            
            // Verify the message text
            await expect(salesPage.noSalesMessage).toHaveText('No sales found');
        }
    });
});
