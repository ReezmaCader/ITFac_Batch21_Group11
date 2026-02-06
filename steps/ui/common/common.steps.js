const { Given, When, Then } = require('@cucumber/cucumber');
const { LoginPage } = require('../../../pages/LoginPage');
const { DashboardPage } = require('../../../pages/DashboardPage');
const { CategoryPage } = require('../../../pages/CategoryPage');

Given('I navigate to the login page', async function () {
    const loginPage = new LoginPage(this.page);
    await loginPage.navigate();
});

When('I login as {string} with password {string}', async function (username, password) {
    const loginPage = new LoginPage(this.page);
    await loginPage.login(username, password);
});

// Add the missing "Add button" step
When('I click on Add button', async function () {
    await this.page.click('button[type="submit"]');
    await this.page.waitForLoadState('networkidle');
});

Then('I should see the Dashboard header {string}', async function (headerText) {
    const dashboardPage = new DashboardPage(this.page);
    await dashboardPage.verifyHeader(headerText);
});

Then('I should be navigated to the {string} page', async function (pageName) {
    if (pageName === 'Categories') {
        await this.page.waitForURL(/.*\/ui\/categories/);
    } else if (pageName === 'Plants') {
        await this.page.waitForURL(/.*\/ui\/plants/);
    }
});