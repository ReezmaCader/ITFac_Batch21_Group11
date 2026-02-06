const { setWorldConstructor, World } = require('@cucumber/cucumber');

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.browser = undefined;
    this.context = undefined;
    this.page = undefined;
    this.apiContext = undefined;
    this.lastApiResponse = undefined;
    this.lastApiBody = undefined;
    this.apiToken = undefined;
    this.adminToken = undefined;
    this.userToken = undefined;
    this.createdCategoryIds = [];
    this.createdPlantIds = [];
    this.createdSaleIds = [];
    this.mainCategoryId = undefined;
    this.subCategoryId = undefined;
    this.plantId = undefined;
    this.mainCategoryName = undefined;
    this.subCategoryName = undefined;
    this.plantName = undefined;
  }
}

setWorldConstructor(CustomWorld);

module.exports = { CustomWorld };
