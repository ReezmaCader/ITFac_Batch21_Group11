markdown# Sales API Testing Framework

BDD-based API testing framework using Cucumber for Sales Management System.

---

## Quick Start
```bash
npm install
# Update support/config.js with JWT tokens
npm test
npm run test:report
```

---

## Test Coverage

- 10 BDD test scenarios written in Gherkin
- 5 User role tests (GET, security, pagination)
- 5 Admin role tests (POST, DELETE, validation)

---

## Project Structure
```
api-testing/
├── api/                    # API clients and utilities
├── features/               # BDD feature files (Gherkin)
├── step-definitions/       # Step implementations
├── support/                # Configuration and hooks
└── reports/                # Test reports
```

---

## Commands
```bash
npm test                    # Run all tests
npm run test:user           # User role tests
npm run test:admin          # Admin role tests
npm run test:report         # Run tests and generate report
npm run test:all:report     # Clean, run, and report
```

---

## Configuration

Edit `support/config.js`:
- Base URL (default: http://localhost:8080)
- Admin JWT token
- User JWT token

See **HOW_TO_GET_TOKENS.md** for token setup.



---

## BDD Approach

Tests are written in Gherkin syntax:
```gherkin
Feature: Sales API User Access
  Scenario: Get sales list successfully
    Given the user has a valid authentication token
    When the user sends a GET request to the sales API
    Then the API should return HTTP status code 200
```

---


---

## Report Location

`reports/html/index.html`

