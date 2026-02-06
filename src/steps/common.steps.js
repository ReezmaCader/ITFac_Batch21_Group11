const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');
const { LoginPage } = require('../pages/login.page');
const { PlantsPage } = require('../pages/plants.page');
const { env } = require('../support/env');
const { getPage } = require('../support/world-helpers');

Given('I am logged in as admin', async function () {
  const page = getPage(this);
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(env.adminUser, env.adminPass);
  await page.waitForURL('**/ui/dashboard');
});

Given('I am logged in as user', async function () {
  const page = getPage(this);
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(env.userUser, env.userPass);
  await page.waitForURL('**/ui/dashboard');
});

When('I navigate to the {string} page', async function (pageName) {
  const page = getPage(this);
  const name = pageName.toLowerCase();

  if (name === 'plants') {
    await new PlantsPage(page).goto();
    return;
  }

  throw new Error(`Unknown page name: ${pageName}`);
});

Then('I should see the {string} page heading', async function (pageName) {
  const page = getPage(this);
  const name = pageName.toLowerCase();

  if (name === 'plants') {
    assert.ok(await new PlantsPage(page).isLoaded(), 'Plants heading not visible.');
    return;
  }

  throw new Error(`Unknown page heading: ${pageName}`);
});
