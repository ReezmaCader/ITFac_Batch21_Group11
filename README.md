# QA Training Tests

**ITFac_Batch21_Group11**

Test automation repository for the ITQA module using Playwright and Cucumber BDD frameworks.

---

## Table of Contents

- [Installation](#installation)
- [Running Tests](#running-tests)
- [Viewing Reports](#viewing-reports)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)
- [Available Commands](#available-commands)

---

## Installation

```bash
git pull origin main
npm install
npx playwright install
```

---

## Running Tests

### Playwright Tests

```bash
# Run all Playwright tests
npm run test:playwright

# Run specific folder
npx playwright test tests/admin
npx playwright test tests/user
```

### Cucumber Tests

```bash
# Run all Cucumber tests (UI + API)
npm run test:cucumber

# Run only UI tests
npx cucumber-js --profile ui

# Run only API tests
npx cucumber-js --profile api
```

### Run All Tests

```bash
npm test
```

---

## Viewing Reports

### Cucumber HTML Reports

```bash
# After running tests, open reports
start reports/ui-cucumber-report.html
start reports/api-cucumber-report.html
```

### Generate Enhanced Report

```bash
# Generate and open enhanced HTML report
npm run report:generate
npm run report:open
```

### Allure Reports

```bash
npx allure serve allure-results
```

### How Reports are Generated

#### Cucumber Reports

1. Tests run and generate JSON files in the `reports/` folder
2. HTML reports are automatically created during test execution
3. Enhanced reports use the `generate-report.js` script which reads JSON files and creates a consolidated HTML report using `multiple-cucumber-html-reporter`

#### Allure Reports

1. Playwright tests generate Allure result files in the `allure-results/` folder during execution
2. Use `allure serve` or `allure generate` commands to create HTML reports from these result files
3. Reports include test history, timelines, graphs, and failure screenshots

---

## Project Structure

```
qa-training-tests/
|
|-- api-test/
|   |-- api/                    # API client classes
|   |-- features/               # API feature files (Gherkin)
|   |   |-- admin/
|   |   |-- user/
|   |-- step-definitions/       # API step implementations
|   |-- support/                # Hooks, config, world
|
|-- ui-tests/
|   |-- features/               # UI feature files (Gherkin)
|   |   |-- admin/
|   |   |-- user/
|   |-- step-definitions/       # UI step implementations
|   |-- support/                # Hooks, helpers, config
|
|-- tests/
|   |-- admin/                  # Playwright admin tests
|   |-- user/                   # Playwright user tests
|   |-- utils/                  # Test data utilities
|
|-- pages/                      # Page Object Model classes
|-- reports/                    # Generated test reports
|-- allure-results/             # Allure result files
|
|-- cucumber.js                 # Cucumber configuration
|-- playwright.config.js        # Playwright configuration
|-- package.json
```

### Cucumber BDD Framework

| Component | Location | Description |
|-----------|----------|-------------|
| **Feature Files** | `ui-tests/features/`, `api-test/features/` | Written in Gherkin language (Given-When-Then). Describe test scenarios in business-readable format. Organized by admin and user folders. |
| **Step Definitions** | `ui-tests/step-definitions/`, `api-test/step-definitions/` | JavaScript files that implement the steps from feature files. Connect Gherkin steps to actual test code. |
| **Hooks** | `ui-tests/support/hooks.js`, `api-test/support/hooks.js` | Before and After hooks that run before/after each scenario. Handle browser setup, teardown, and capture screenshots on failure. |
| **World** | Context object in hooks | Shared context between steps in a scenario. Stores page objects, browser instances, and test data. Accessible via `this` in step definitions. |
| **Pages** | `pages/` | Page Object Model (POM) classes. Encapsulate page elements and actions. Reusable across different tests. |

### Playwright Framework

| Component | Location | Description |
|-----------|----------|-------------|
| **Test Files** | `tests/admin/`, `tests/user/` | End with `.spec.js` extension. Written using Playwright test syntax. Use Page Object Model for maintainability. |
| **Configuration** | `playwright.config.js` | Defines browser settings, base URL, timeouts. Configures reporters (HTML, JSON, Allure). Sets up test execution parameters. |

---

## How It Works

### Cucumber BDD Workflow

```
Feature File (Gherkin)
        |
        v
Cucumber Parser (matches steps)
        |
        v
Step Definitions (execute code)
        |
        v
Hooks (setup/teardown)
        |
        v
Reports (JSON, HTML, Allure)
```

1. Feature file defines scenario in Gherkin syntax
2. Cucumber reads feature file and matches steps to definitions
3. Step definitions execute corresponding test code
4. Hooks run before/after each scenario for setup/teardown
5. Test results are captured and formatted into reports

### Playwright Workflow

```
Test File (.spec.js)
        |
        v
Import Page Objects
        |
        v
Launch Browser & Navigate
        |
        v
Perform Actions via Page Objects
        |
        v
Assert Expected Behavior
        |
        v
Collect Results (Reporters)
```

1. Test files import page objects and test utilities
2. Playwright launches browser and navigates to application
3. Page objects perform actions on UI elements
4. Assertions verify expected behavior
5. Results are collected by configured reporters

---

## Development Guidelines

### Creating Tests

#### Playwright Tests

1. Create `.spec.js` files in `tests/admin/` or `tests/user/`
2. Use Page Object Model from `pages/`
3. Follow existing test patterns

#### Cucumber Tests

1. Write feature files in `ui-tests/features/` or `api-test/features/`
2. Implement step definitions in corresponding `step-definitions/` folder
3. Use tags for categorization: `@admin`, `@user`, `@positive`, `@negative`

### Branching

```bash
git checkout -b feature/your-name-feature
# Make changes
git add .
git commit -m "Description"
git push origin feature/your-name-feature
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Missing dependencies | `npm install` |
| Playwright browsers not installed | `npx playwright install` |
| Clean all reports | `Remove-Item -Recurse -Force allure-results, allure-report, reports -ErrorAction SilentlyContinue` |

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:playwright` | Run Playwright tests |
| `npm run test:cucumber` | Run Cucumber tests |
| `npm run report:generate` | Generate HTML report |
| `npm run report:open` | Open generated report |

---

**ITFac Batch 21 - Group 11**