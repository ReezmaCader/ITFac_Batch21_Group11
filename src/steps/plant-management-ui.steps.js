const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');
const { getPage } = require('../support/world-helpers');
const { PlantsPage } = require('../pages/plants.page');
const { createPlant, createSubCategory } = require('../support/test-data');

Given('a plant exists in the system', async function () {
  await createPlant(this);
});

Given('a plant named {string} exists in the system', async function (name) {
  const result = await createPlant(this, { name });
  if (!result.id) {
    await createPlant(this, { name: `${name}-${Date.now()}` });
  }
});

Given('plants exist in multiple categories', async function () {
  const first = await createSubCategory(this, `C${Date.now().toString().slice(-6)}`);
  await createPlant(this, { name: `AutoPlant-${Date.now()}`, price: 5 });

  const originalSubId = this.subCategoryId;
  const originalSubName = this.subCategoryName;

  await createSubCategory(this, `D${Date.now().toString().slice(-6)}`);
  await createPlant(this, { name: `AutoPlant-${Date.now()}-B`, price: 15 });

  if (first.id) {
    this.subCategoryId = originalSubId ?? first.id;
    this.subCategoryName = originalSubName ?? first.name;
  }
});

When('I search for the plant name {string}', async function (name) {
  const page = getPage(this);
  const plants = new PlantsPage(page);
  await plants.searchForPlant(this.plantName ?? name);
});

When('I filter plants by category', async function () {
  if (!this.subCategoryName) {
    await createSubCategory(this);
  }
  if (!this.subCategoryName) {
    throw new Error('Category name is not available for filtering.');
  }

  const page = getPage(this);
  const plants = new PlantsPage(page);
  await plants.selectCategory(this.subCategoryName);
  await page.getByRole('button', { name: 'Search' }).click();
});

When('I sort plants by price', async function () {
  const page = getPage(this);
  const plants = new PlantsPage(page);
  await Promise.all([
    page.waitForLoadState('domcontentloaded'),
    plants.clickSortByPrice()
  ]);
});

When('I open the Add Plant form', async function () {
  const page = getPage(this);
  await page.getByRole('link', { name: 'Add a Plant' }).click();
});

When('I click Cancel on the Add Plant form', async function () {
  const page = getPage(this);
  await page.getByRole('link', { name: 'Cancel' }).click();
});

When('I delete the plant from the list', async function () {
  if (!this.plantName) {
    await createPlant(this);
  }
  if (!this.plantName) {
    throw new Error('Plant name is not available for deletion.');
  }

  const page = getPage(this);
  const plants = new PlantsPage(page);
  await plants.searchForPlant(this.plantName);

  page.once('dialog', (dialog) => dialog.accept());
  await Promise.all([
    page.waitForLoadState('domcontentloaded'),
    plants.deletePlantByName(this.plantName)
  ]);
});

Then('the category filter should be visible', async function () {
  const page = getPage(this);
  const plants = new PlantsPage(page);
  assert.ok(await plants.isCategoryFilterVisible(), 'Category filter is not visible.');
});

Then('the Edit and Delete actions should not be visible', async function () {
  const page = getPage(this);
  const plants = new PlantsPage(page);
  const editVisible = await plants.hasEditButton();
  const deleteVisible = await plants.hasDeleteButton();
  assert.ok(!editVisible && !deleteVisible, 'Edit/Delete buttons are visible for user.');
});

Then('the Edit button should be visible for plants', async function () {
  const page = getPage(this);
  const plants = new PlantsPage(page);
  assert.ok(await plants.hasEditButton(), 'Edit button is not visible for admin.');
});

Then('the Delete button should be visible for plants', async function () {
  const page = getPage(this);
  const plants = new PlantsPage(page);
  assert.ok(await plants.hasDeleteButton(), 'Delete button is not visible for admin.');
});

Then('the plant should appear in results with name {string}', async function (name) {
  const page = getPage(this);
  const plants = new PlantsPage(page);
  const names = await plants.getPlantNames();
  const expected = this.plantName ?? name;
  assert.ok(names.some((n) => n.includes(expected)), `Plant ${expected} not found in results.`);
});

Then('no plant results should be shown', async function () {
  const page = getPage(this);
  const plants = new PlantsPage(page);
  assert.ok(await plants.isNoResultsVisible(), 'No-results message not shown.');
});

Then('all listed plants should belong to the selected category', async function () {
  const page = getPage(this);
  const plants = new PlantsPage(page);
  const categories = await plants.getPlantCategories();
  assert.ok(categories.length > 0, 'No plant categories found in results.');
  const target = this.subCategoryName;
  assert.ok(target, 'Selected category name is not available.');
  assert.ok(categories.every((c) => c === target), 'Not all rows match the selected category.');
});

Then('plant prices should be sorted', async function () {
  const page = getPage(this);
  const plants = new PlantsPage(page);
  const prices = await plants.getPlantPrices();
  assert.ok(prices.length > 1, 'Not enough prices to verify sorting.');

  const ascending = prices.every((v, i, arr) => i === 0 || arr[i - 1] <= v);
  const descending = prices.every((v, i, arr) => i === 0 || arr[i - 1] >= v);
  assert.ok(ascending || descending, 'Prices are not sorted.');
});

Then('the plant should be removed from the list', async function () {
  const page = getPage(this);
  const plants = new PlantsPage(page);
  const name = this.plantName ?? '';
  await plants.searchForPlant(name);
  assert.ok(await plants.isNoResultsVisible(), 'Deleted plant still appears in results.');
});

Then('I should be back on the plant list page', async function () {
  const page = getPage(this);
  await page.waitForURL('**/ui/plants');
});
