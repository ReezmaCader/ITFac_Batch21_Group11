/**
 * Cucumber Test Runner - Unified Runner for UI and API Tests
 * Run with: node run-cucumber.js [type] [role]
 * Examples:
 *   node run-cucumber.js              - Run all tests (UI + API)
 *   node run-cucumber.js ui           - Run all UI tests
 *   node run-cucumber.js api          - Run all API tests
 *   node run-cucumber.js ui user      - Run UI user tests only
 *   node run-cucumber.js api admin    - Run API admin tests only
 */

const { execSync } = require('child_process');

const args = process.argv.slice(2);
const testType = args[0] || 'all';
const role = args[1] || '';

function runTests(profile) {
  const command = `npx cucumber-js --profile ${profile}`;
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Running tests with profile: ${profile}`);
  console.log(`${'='.repeat(60)}\n`);
  
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    return false;
  }
}

let success = true;

switch (testType) {
  case 'all':
    // Run both UI and API tests regardless of individual failures
    const uiSuccess = runTests('ui');
    const apiSuccess = runTests('api');
    success = uiSuccess && apiSuccess;
    break;
  case 'ui':
    success = runTests(role ? `ui:${role}` : 'ui');
    break;
  case 'api':
    success = runTests(role ? `api:${role}` : 'api');
    break;
  default:
    console.log('Invalid test type. Use: all, ui, or api');
    console.log('Examples:');
    console.log('  node run-cucumber.js          - Run all tests');
    console.log('  node run-cucumber.js ui       - Run all UI tests');
    console.log('  node run-cucumber.js api      - Run all API tests');
    console.log('  node run-cucumber.js ui user  - Run UI user tests');
    console.log('  node run-cucumber.js api admin - Run API admin tests');
    process.exit(1);
}

process.exit(success ? 0 : 1);
