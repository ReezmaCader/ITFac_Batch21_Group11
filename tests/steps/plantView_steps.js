const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { PlantViewPage } = require('../pages/plantViewPage');

let plantViewPage;

Given('the user is logged in as User', async () => {
  // Assume login already handled or mocked
});

When('the user navigates to the plant list page', async () => {
  plantViewPage = new PlantViewPage(page);
  await plantViewPage.navigateToPlantList();
});

Then('the plant list should be displayed', async () => {
  const isVisible = await plantViewPage.isPlantListVisible();
  expect(isVisible).toBeTruthy();
});
