const { Before, After, BeforeAll, AfterAll, Status } = require('@cucumber/cucumber');
const config = require('./config');

BeforeAll(function () {
  console.log('='.repeat(60));
  console.log('🚀 Starting API Test Suite');
  console.log(`📍 Base URL: ${config.baseURL}`);
  console.log('='.repeat(60));
});

Before(function (scenario) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`▶️  Scenario: ${scenario.pickle.name}`);
  console.log(`   Tags: ${scenario.pickle.tags.map(t => t.name).join(', ')}`);
  console.log(`${'─'.repeat(60)}`);
});

After(async function (scenario) {
  const status = scenario.result.status === Status.PASSED ? '✅' : '❌';
  console.log(`${status} Scenario ${scenario.result.status}: ${scenario.pickle.name}`);
  
  if (scenario.result.status === Status.FAILED) {
    const response = this.getResponse();
    if (response) {
      console.log('\n🔍 Last API Response:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Data: ${JSON.stringify(response.data, null, 2)}`);
    }
  }
  
  await cleanupCreatedResources.call(this);
});

AfterAll(function () {
  console.log('\n' + '='.repeat(60));
  console.log('🏁 Test Suite Completed');
  console.log('='.repeat(60) + '\n');
});

async function cleanupCreatedResources() {
  const createdCategories = this.getCreatedResources('categories');
  
  if (createdCategories.length > 0) {
    console.log(`\n🧹 Cleaning up ${createdCategories.length} created categories...`);
    
    const adminToken = config.tokens.admin;
    await this.setAuthToken(adminToken);
    
    for (const categoryId of createdCategories) {
      try {
        await this.categoryClient.deleteCategory(categoryId);
        console.log(`   ✓ Deleted category ID: ${categoryId}`);
      } catch (error) {
        console.log(`   ✗ Failed to delete category ID: ${categoryId}`);
      }
    }
  }
}
