/**
 * Cucumber Configuration for UI and API Tests
 */

module.exports = {
  default: {
    paths: ['ui-tests/features/**/*.feature'],
    require: [
      'ui-tests/step-definitions/**/*.js',
      'ui-tests/support/**/*.js'
    ],
    format: [
      'progress-bar',
      'html:reports/ui-cucumber-report.html',
      'json:reports/cucumber-report.json'  // ✅ Just JSON
    ],
    publish: false,
    failFast: false,
    parallel: 1,
    formatOptions: { snippetInterface: 'async-await' }
  },
  
  'ui': {
    paths: ['ui-tests/features/**/*.feature'],
    require: [
      'ui-tests/step-definitions/**/*.js',
      'ui-tests/support/**/*.js'
    ],
    format: [
      'progress-bar',
      'html:reports/ui-cucumber-report.html',
      'json:reports/cucumber-report.json'  // ✅ Just JSON
    ],
    publish: false,
    formatOptions: { snippetInterface: 'async-await' }
  },
  
  'ui:user': {
    paths: ['ui-tests/features/user/**/*.feature'],
    require: [
      'ui-tests/step-definitions/**/*.js',
      'ui-tests/support/**/*.js'
    ],
    format: ['progress-bar', 'json:reports/cucumber-report.json'],
    tags: '@user'
  },
  
  'ui:admin': {
    paths: ['ui-tests/features/admin/**/*.feature'],
    require: [
      'ui-tests/step-definitions/**/*.js',
      'ui-tests/support/**/*.js'
    ],
    format: ['progress-bar', 'json:reports/cucumber-report.json'],
    tags: '@admin'
  },
  
  'api': {
    paths: ['api-test/features/**/*.feature'],
    require: [
      'api-test/step-definitions/**/*.js',
      'api-test/support/**/*.js'
    ],
    format: [
      'progress-bar',
      'html:reports/api-cucumber-report.html',
      'json:reports/cucumber-report.json'  // ✅ Just JSON
    ],
    publish: false,
    formatOptions: { snippetInterface: 'async-await' }
  },
  
  'api:user': {
    paths: ['api-test/features/user/**/*.feature'],
    require: [
      'api-test/step-definitions/**/*.js',
      'api-test/support/**/*.js'
    ],
    format: ['progress-bar', 'json:reports/cucumber-report.json'],
    tags: '@user'
  },
  
  'api:admin': {
    paths: ['api-test/features/admin/**/*.feature'],
    require: [
      'api-test/step-definitions/**/*.js',
      'api-test/support/**/*.js'
    ],
    format: ['progress-bar', 'json:reports/cucumber-report.json'],
    tags: '@admin'
  }
};