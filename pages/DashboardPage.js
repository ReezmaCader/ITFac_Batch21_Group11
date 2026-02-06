const { expect } = require('@playwright/test');

class DashboardPage {
    constructor(page) {
        this.page = page;
        
        // Page elements
        this.header = 'h3.mb-4';
        this.sidebarLogo = '.sidebar-logo img';
        this.sidebar = '.sidebar';
        
        // Cards
        this.cardTitles = '.card-body h6.fw-semibold';
        this.statsNumbers = '.fw-bold.fs-5';

        // Buttons inside cards
        this.manageCategoriesBtn = 'a.btn-outline-primary[href="/ui/categories"]';
        this.managePlantsBtn = 'a.btn-outline-success[href="/ui/plants"]';
        this.viewSalesBtn = 'a.btn-outline-primary[href="/ui/sales"]';
        
        // Sidebar Links
        this.dashboardSidebarLink = '.sidebar a[href="/ui/dashboard"]';
        this.categoriesSidebarLink = '.sidebar a[href="/ui/categories"]';
        this.plantsSidebarLink = '.sidebar a[href="/ui/plants"]';
        this.salesSidebarLink = '.sidebar a[href="/ui/sales"]';
        this.inventorySidebarLink = '.sidebar a[title="Inventory page coming soon"]';
    }

    async verifyOnPage() {
        await expect(this.page).toHaveURL(/.*\/ui\/dashboard/);
    }

    async verifyHeader(text) {
        await expect(this.page.locator(this.header)).toHaveText(text);
    }

    async verifyCardVisible(cardName) {
        const cardTitle = this.page.locator(this.cardTitles, { hasText: cardName });
        await expect(cardTitle).toBeVisible();
    }

    async verifySidebarMenuActive(menuName) {
        let selector = '';
        
        if (menuName === 'Dashboard') selector = this.dashboardSidebarLink;
        if (menuName === 'Categories') selector = this.categoriesSidebarLink;
        if (menuName === 'Plants') selector = this.plantsSidebarLink;
        if (menuName === 'Sales') selector = this.salesSidebarLink;
        
        const activeLink = this.page.locator(`${selector}.active`);
        await expect(activeLink).toBeVisible();
    }

    async clickManageCategories() {
        await this.page.click(this.manageCategoriesBtn);
    }

    async clickManagePlants() {
        await this.page.click(this.managePlantsBtn);
    }

    async clickSidebarLink(linkName) {
        if (linkName === 'Dashboard') await this.page.click(this.dashboardSidebarLink);
        if (linkName === 'Categories') await this.page.click(this.categoriesSidebarLink);
        if (linkName === 'Plants') await this.page.click(this.plantsSidebarLink);
        if (linkName === 'Sales') await this.page.click(this.salesSidebarLink);
        
        await this.page.waitForLoadState('networkidle');
    }
}

module.exports = { DashboardPage };