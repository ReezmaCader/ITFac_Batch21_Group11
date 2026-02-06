const { env } = require('../support/env');

class PlantsPage {
  constructor(page) {
    this.page = page;
    this.heading = page.locator('h3', { hasText: 'Plants' });
    this.addButton = page.getByRole('link', { name: 'Add a Plant' });
    this.searchInput = page.locator('input[name="name"][placeholder="Search plant"]');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.categoryFilter = page.locator('select[name="categoryId"]');
    this.tableRows = page.locator('table tbody tr');
  }

  async goto() {
    await this.page.goto(`${env.baseUrl}/ui/plants`, { waitUntil: 'domcontentloaded' });
  }

  async isLoaded() {
    return this.heading.isVisible();
  }

  async isAddButtonVisible() {
    return this.addButton.isVisible();
  }

  async isSearchVisible() {
    return this.searchInput.isVisible();
  }

  async isCategoryFilterVisible() {
    return this.categoryFilter.isVisible();
  }

  async searchForPlant(name) {
    await this.searchInput.fill(name);
    await this.searchButton.click();
  }

  async selectCategory(name) {
    await this.categoryFilter.selectOption({ label: name });
  }

  async clickSortByPrice() {
    await this.page.getByRole('link', { name: 'Price' }).click();
  }

  async hasEditButton() {
    return this.page.locator('a[title="Edit"]').first().isVisible();
  }

  async hasDeleteButton() {
    return this.page.locator('button[title="Delete"]').first().isVisible();
  }

  async deletePlantByName(name) {
    const row = this.tableRows.filter({ hasText: name }).first();
    const deleteButton = row.locator('button[title="Delete"]');
    await deleteButton.click();
  }

  async getPlantNames() {
    const rows = await this.tableRows.all();
    const names = [];
    for (const row of rows) {
      const rowText = (await row.textContent()) ?? '';
      if (rowText.includes('No plants found')) {
        continue;
      }
      const text = (await row.locator('td').first().textContent()) ?? '';
      if (text.trim()) {
        names.push(text.trim());
      }
    }
    return names;
  }

  async getPlantCategories() {
    const rows = await this.tableRows.all();
    const categories = [];
    for (const row of rows) {
      const rowText = (await row.textContent()) ?? '';
      if (rowText.includes('No plants found')) {
        continue;
      }
      const text = (await row.locator('td').nth(1).textContent()) ?? '';
      if (text.trim()) {
        categories.push(text.trim());
      }
    }
    return categories;
  }

  async getPlantPrices() {
    const rows = await this.tableRows.all();
    const prices = [];
    for (const row of rows) {
      const rowText = (await row.textContent()) ?? '';
      if (rowText.includes('No plants found')) {
        continue;
      }
      const text = (await row.locator('td').nth(2).textContent()) ?? '';
      const value = Number(text.replace(/[^0-9.]/g, ''));
      if (!Number.isNaN(value)) {
        prices.push(value);
      }
    }
    return prices;
  }

  async isNoResultsVisible() {
    return this.page.locator('table tbody tr', { hasText: 'No plants found' }).isVisible();
  }
}

module.exports = { PlantsPage };
