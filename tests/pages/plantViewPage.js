class PlantViewPage {
  constructor(page) {
    this.page = page;
    this.plantTable = page.locator('table');
  }

  async navigateToPlantList() {
    await this.page.goto('/ui/plants');
  }

  async isPlantListVisible() {
    return await this.plantTable.isVisible();
  }
}

module.exports = { PlantViewPage };
