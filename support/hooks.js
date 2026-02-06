const { Before, After, BeforeAll, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test'); // Remove 'request' import

setDefaultTimeout(30 * 1000);

let browser;

BeforeAll(async function () {
    browser = await chromium.launch({ headless: false });
});

AfterAll(async function () {
    await browser.close();
});

// UI Context Setup ONLY (not for @api tagged scenarios)
Before({ tags: "not @api" }, async function () { 
    this.context = await browser.newContext();
    this.page = await this.context.newPage();
});


After(async function () {
    if (this.page) await this.page.close();
    if (this.context) await this.context.close();
    if (this.apiContext) await this.apiContext.dispose();
});