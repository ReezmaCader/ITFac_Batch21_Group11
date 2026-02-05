/**
 * Cucumber Configuration
 * 
 * This file configures Cucumber behavior and test execution
 * Learn more: https://github.com/cucumber/cucumber-js/blob/main/docs/configuration.md
 */

module.exports = {
  default: {
    // Feature files location
    require: [
      'step-definitions/**/*.js',  // Step definitions
      'api/context/TestContext.js', // World object
      'support/**/*.js'             // Hooks and helpers
    ],
    
    // Format options
    format: [
      'progress-bar',                // Show progress during execution
      'html:reports/cucumber-report.html', // HTML report
      'json:reports/cucumber-report.json'  // JSON report for multiple-cucumber-html-reporter
    ],
    
    // Publish results (set to false for local testing)
    publish: false,
    
    // Fail fast - stop on first failure (useful during development)
    failFast: false,
    
    // Parallel execution (increase for faster runs)
    parallel: 1,
    
    // Format options
    formatOptions: {
      snippetInterface: 'async-await'
    }
  },
  
  // Profile for running only user tests
  user: {
    require: [
      'step-definitions/**/*.js',
      'api/context/TestContext.js',
      'support/**/*.js'
    ],
    format: ['progress-bar', 'json:reports/user-report.json'],
    tags: '@user'
  },
  
  // Profile for running only admin tests
  admin: {
    require: [
      'step-definitions/**/*.js',
      'api/context/TestContext.js',
      'support/**/*.js'
    ],
    format: ['progress-bar', 'json:reports/admin-report.json'],
    tags: '@admin'
  }
};
