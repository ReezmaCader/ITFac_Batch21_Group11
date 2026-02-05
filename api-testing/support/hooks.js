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
  const createdSales = this.getCreatedResources('sales');
  
  if (createdSales.length > 0) {
    console.log(`\n🧹 Cleaning up ${createdSales.length} created sales...`);
    
    const adminToken = config.tokens.admin;
    this.setAuthToken(adminToken);
    
    for (const saleId of createdSales) {
      try {
        await this.salesClient.deleteSale(saleId);
        console.log(`   ✓ Deleted sale ID: ${saleId}`);
      } catch (error) {
        console.log(`   ✗ Failed to delete sale ID: ${saleId}`);
      }
    }
  }
}
