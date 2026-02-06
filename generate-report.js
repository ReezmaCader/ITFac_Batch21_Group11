const report = require('multiple-cucumber-html-reporter');
const fs = require('fs');
const path = require('path');

// Ensure reports directory exists
const reportsDir = './reports';
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Check if any JSON reports exist
const jsonFiles = fs.readdirSync(reportsDir).filter(f => f.endsWith('.json'));

if (jsonFiles.length === 0) {
  console.log('No Cucumber JSON reports found. Run tests first.');
  process.exit(0);
}

report.generate({
  jsonDir: reportsDir,
  reportPath: './reports/html',
  metadata: {
    browser: {
      name: 'chromium',
      version: 'latest'
    },
    device: 'Local test machine',
    platform: {
      name: 'Windows',
      version: '10'
    }
  },
  customData: {
    title: 'Test Execution Report',
    data: [
      { label: 'Project', value: 'Dashboard and Category' },
      { label: 'Test Types', value: 'UI Tests + API Tests (Cucumber + Playwright)' },
      { label: 'Execution Date', value: new Date().toLocaleDateString() }
    ]
  }
});

console.log('Report generated successfully at ./reports/html/index.html');
