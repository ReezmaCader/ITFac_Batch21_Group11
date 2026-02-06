const { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('@playwright/test');
const config = require('./config');
const { ensureTestPlantsExist } = require('../../tests/utils/plantData');

setDefaultTimeout(config.timeout.default);

let browser;

BeforeAll(async function () {
  console.log('='.repeat(60));
  console.log('Starting UI Test Suite');
  console.log(`Base URL: ${config.baseURL}`);
  console.log('='.repeat(60));
  
  // Ensure test plants exist with stock before running tests
  await ensureTestPlantsExist();
  
  browser = await chromium.launch({
    headless: config.browser.headless,
    slowMo: config.browser.slowMo
  });
});

Before(async function (scenario) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`Scenario: ${scenario.pickle.name}`);
  console.log(`Tags: ${scenario.pickle.tags.map(t => t.name).join(', ')}`);
  console.log(`${'─'.repeat(60)}`);
  
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  this.config = config;
});

After(async function (scenario) {
  const status = scenario.result.status === Status.PASSED ? 'PASSED' : 'FAILED';
  console.log(`${status}: ${scenario.pickle.name}`);
  
  if (scenario.result.status === Status.FAILED) {
    const screenshot = await this.page.screenshot();
    // this.attach(screenshot, 'image/png');
    // console.log('Screenshot captured for failed scenario');
  }
  
  if (this.context) {
    await this.context.close();
  }
});

AfterAll(async function () {
  console.log('\n' + '='.repeat(60));
  console.log('UI Test Suite Completed');
  console.log('='.repeat(60) + '\n');
  
  if (browser) {
    await browser.close();
  }
});
