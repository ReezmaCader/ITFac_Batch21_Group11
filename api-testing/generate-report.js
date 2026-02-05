const report = require('multiple-cucumber-html-reporter');
const path = require('path');

/**
 * Generate HTML Report from Cucumber JSON
 * 
 * This script generates a beautiful HTML report from Cucumber test results
 * Run this after tests: node generate-report.js
 */

report.generate({
  jsonDir: './reports',
  reportPath: './reports/html',
  
  metadata: {
    browser: {
      name: 'API Testing',
      version: 'N/A'
    },
    device: 'Local Machine',
    platform: {
      name: process.platform,
      version: process.version
    }
  },
  
  customData: {
    title: 'Sales API Test Results',
    data: [
      { label: 'Project', value: 'QA Training - API Testing' },
      { label: 'Release', value: '1.0.0' },
      { label: 'Test Type', value: 'API Automation' },
      { label: 'Framework', value: 'Cucumber.js + Axios' },
      { label: 'Execution Date', value: new Date().toLocaleString() }
    ]
  },
  
  pageTitle: 'Sales API Test Report',
  reportName: 'Sales API Automation Report',
  displayDuration: true,
  displayReportTime: true,
  
  // Styling
  openReportInBrowser: true,
  saveCollectedJSON: true
});

console.log('✅ HTML Report generated successfully!');
console.log(`📊 View report: ${path.resolve('./reports/html/index.html')}`);
