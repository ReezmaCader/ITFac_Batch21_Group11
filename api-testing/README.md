# 🚀 Sales API Testing Framework

Complete Cucumber-based API testing framework for the QA Training Sales Management System.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure authentication (see HOW_TO_GET_TOKENS.md)
# Update support/config.js with your JWT tokens

# 3. Run tests
npm test

# 4. Generate HTML report
node generate-report.js
```

---

## 📚 Documentation

### 🎯 **Start Here**
👉 **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Master index to all documentation

### Essential Guides
| Document | Purpose |
|----------|---------|
| **[GETTING_STARTED.md](GETTING_STARTED.md)** | ✅ Step-by-step setup checklist |
| **[TESTING_GUIDE.md](TESTING_GUIDE.md)** | 📖 Complete framework guide (400+ lines) |
| **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** | ⚡ Commands and syntax cheat sheet |
| **[HOW_TO_GET_TOKENS.md](HOW_TO_GET_TOKENS.md)** | 🔐 Authentication setup guide |
| **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** | 🔧 Common issues and solutions |
| **[ARCHITECTURE_DIAGRAMS.md](ARCHITECTURE_DIAGRAMS.md)** | 🎨 Visual architecture diagrams |

---

## 🎯 Test Coverage

### ✅ **10 Automated Test Cases**

**User Role Tests (5)**
- Get sales list with validation
- Restrict sale creation (403)
- Restrict sale deletion (403)
- Pagination support
- Unauthenticated access (401)

**Admin Role Tests (5)**
- Create sale successfully
- Validate zero/negative quantity
- Validate stock availability
- Delete sale successfully
- Validate missing plant ID

---

## 📁 Project Structure

```
api-testing/
├── api/
│   ├── base/
│   │   └── ApiClient.js          # Base HTTP client (Axios)
│   ├── clients/
│   │   └── SalesClient.js        # Sales API methods
│   └── context/
│       └── TestContext.js        # World object (state)
├── features/
│   ├── admin/
│   │   └── sales_api_admin.feature
│   └── user/
│       └── sales_api_user.feature
├── step-definitions/
│   ├── admin/
│   │   └── salesApiAdminSteps.js
│   └── user/
│       └── salesApiUserSteps.js
├── support/
│   ├── config.js                 # Configuration
│   └── hooks.js                  # Before/After hooks
├── reports/                      # Generated reports
├── cucumber.js                   # Cucumber config
└── generate-report.js            # HTML report generator
```

---

## 🚀 Running Tests

```bash
# All tests
npm test

# By role
npm run test:user
npm run test:admin

# By scenario type
npm run test:positive
npm run test:negative

# By tag
npx cucumber-js --tags "@get"
npx cucumber-js --tags "@security"

# Generate HTML report
node generate-report.js
```

---

## 🛠️ Technologies

- **Cucumber.js** v12.6.0 - BDD test framework
- **Axios** v1.13.4 - HTTP client
- **Node.js** - JavaScript runtime
- **multiple-cucumber-html-reporter** - HTML reporting

---

## ⚙️ Configuration

**Required:** Update `support/config.js` with:
1. Your Spring Boot base URL (default: `http://localhost:8080`)
2. Valid JWT tokens (user and admin)

**See:** [HOW_TO_GET_TOKENS.md](HOW_TO_GET_TOKENS.md) for token setup instructions

---

## 📊 Features

✅ **Modular Architecture** - Clean separation of concerns  
✅ **BDD with Gherkin** - Business-readable test scenarios  
✅ **Complete Documentation** - 8 comprehensive guides  
✅ **Tag-Based Execution** - Run specific test subsets  
✅ **Beautiful Reports** - HTML reports with details  
✅ **Resource Cleanup** - Automatic cleanup after tests  
✅ **Test Isolation** - Each scenario runs independently  
✅ **Extensive Logging** - Debug-friendly console output  
✅ **Production Ready** - Industry best practices  
✅ **Easy to Extend** - Add new APIs and tests easily  

---

## 🎓 Learning Resources

### For Beginners
1. Read [GETTING_STARTED.md](GETTING_STARTED.md) - Setup checklist
2. Review [TESTING_GUIDE.md](TESTING_GUIDE.md) - Complete guide
3. Study [EXECUTION_FLOW.js](EXECUTION_FLOW.js) - Understand flow

### For Intermediate
1. Review [ARCHITECTURE_DIAGRAMS.md](ARCHITECTURE_DIAGRAMS.md) - Visual learning
2. Study code comments in all files
3. Try adding a new test

### Quick Reference
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Commands and syntax
- [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) - Find anything

---

## 🔧 Troubleshooting

Having issues? Check:
1. [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Common problems and solutions
2. Verify Spring Boot app is running
3. Ensure tokens are valid and up-to-date
4. Review console output for specific errors

---

## 📦 What's Included

- ✅ Complete testing framework
- ✅ 10 automated test cases
- ✅ 2,500+ lines of documentation
- ✅ Visual architecture diagrams
- ✅ Code examples and templates
- ✅ Troubleshooting guides
- ✅ Best practices documentation

See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for complete details.

---

## 🎯 Next Steps

1. **Setup:** Follow [GETTING_STARTED.md](GETTING_STARTED.md)
2. **Learn:** Read [TESTING_GUIDE.md](TESTING_GUIDE.md)
3. **Run:** Execute tests and generate reports
4. **Extend:** Add your own test cases

---

## 📝 Installation Commands (Reference)

```bash
npm init -y
npm install -D @cucumber/cucumber
npm install axios
npm install -D multiple-cucumber-html-reporter
```

---

**📚 For complete documentation, visit [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)**
