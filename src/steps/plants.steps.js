const { Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');
const { PlantsPage } = require('../pages/plants.page');
const { getPage } = require('../support/world-helpers');

Then('I should see the Add Plant button', async function () {
  const page = getPage(this);
  const plants = new PlantsPage(page);
  assert.ok(await plants.isAddButtonVisible(), 'Add Plant button is not visible.');
});

Then('I should not see the Add Plant button', async function () {
  const page = getPage(this);
  const plants = new PlantsPage(page);
  const visible = await plants.isAddButtonVisible();
  assert.ok(!visible, 'Add Plant button is visible for a non-admin user.');
});

Then('the Plants search input should be visible', async function () {
  const page = getPage(this);
  const plants = new PlantsPage(page);
  assert.ok(await plants.isSearchVisible(), 'Plant search input not visible.');
});
