# QA Training Tests - BDD Test Automation

## 🚀 Test Commands

```bash
# Run ALL tests (UI + API)
npm run test:cucumber

# Run UI tests only
npx cucumber-js --profile ui

# Run API tests only
npx cucumber-js --profile api

# Run by role
npx cucumber-js --profile ui:admin    # Admin UI tests
npx cucumber-js --profile ui:user     # User UI tests
npx cucumber-js --profile api:admin   # Admin API tests
npx cucumber-js --profile api:user    # User API tests

# Run specific test case
npx cucumber-js --tags @TC_DASHBOARD_UI_USER_001
```

## 📁 Project Structure

| Folder | Purpose |
|--------|---------|
| `ui-tests/features/` | Gherkin feature files for UI tests |
| `ui-tests/step-definitions/` | Step implementations for UI scenarios |
| `ui-tests/support/` | Hooks, helpers, config for UI tests |
| `api-test/features/` | Gherkin feature files for API tests |
| `api-test/step-definitions/` | Step implementations for API scenarios |
| `api-test/api/` | API clients (CategoryClient, AuthClient) |
| `pages/` | Page Object Model classes |
| `reports/` | Test execution reports (HTML/JSON) |

## 🔄 BDD Workflow

```
Feature File (.feature)  →  Step Definitions (.js)  →  Page Objects / API Clients  →  Application
     ↓                            ↓                              ↓
  Gherkin syntax            Cucumber matches              Playwright executes
  (Given/When/Then)         steps to code                 actions & assertions
```

**How it works:**
1. **Feature files** define test scenarios in plain English (Gherkin)
2. **Step definitions** map Gherkin steps to JavaScript code
3. **Cucumber** parses features and executes matching steps
4. **Playwright** performs browser/API actions
5. **Reports** generated in `reports/` folder

## 📋 Test Coverage

| ID Range | Description |
|----------|-------------|
| TC_DASHBOARD_UI_USER_001-006 | User: pagination, search, filter, sorting |
| TC_DASHBOARD_UI_ADMIN_007-017 | Admin: login, dashboard, category CRUD |
| API_USER_018-029 | User API: read-only, auth checks |
| API_ADMIN_030-038 | Admin API: full CRUD |

## ⚙️ Setup

```bash
npm install
# App must run at http://localhost:8080
```