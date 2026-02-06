const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const { env } = require('./env');
const { authHeaders, createApiContext, loginForToken } = require('./api-client');

setDefaultTimeout(env.timeoutMs * 3);

Before(async function () {
  this.apiContext = await createApiContext();
  this.browser = await chromium.launch({ headless: env.headless });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(env.timeoutMs);
  this.page.setDefaultNavigationTimeout(env.timeoutMs);
});

After(async function () {
  if (this.apiContext) {
    if (!this.adminToken) {
      try {
        this.adminToken = await loginForToken(
          this.apiContext,
          env.adminUser,
          env.adminPass
        );
      } catch {
        this.adminToken = undefined;
      }
    }

    const headers = authHeaders(this.adminToken);

    for (const saleId of [...this.createdSaleIds].reverse()) {
      try {
        await this.apiContext.delete(`/api/sales/${saleId}`, { headers });
      } catch {
        // ignore cleanup failures
      }
    }

    for (const plantId of [...this.createdPlantIds].reverse()) {
      try {
        await this.apiContext.delete(`/api/plants/${plantId}`, { headers });
      } catch {
        // ignore cleanup failures
      }
    }

    for (const categoryId of [...this.createdCategoryIds].reverse()) {
      try {
        await this.apiContext.delete(`/api/categories/${categoryId}`, { headers });
      } catch {
        // ignore cleanup failures
      }
    }

    await this.apiContext.dispose();
    this.apiContext = undefined;
  }

  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});
