# QA Training App Automation (Playwright + Cucumber + JavaScript)

This project is a starter automation framework for the **QA Training App** using Playwright and Cucumber in JavaScript.

## 1) Prerequisites

- **Java JDK 21**
- **MySQL 8.0**
- **Node.js 20+** (LTS recommended)
- **Google Chrome** (recommended browser)

## 2) Run the QA Training App (local)

The app artifacts are already in this repo under `QA Training App/`.

1. Start MySQL and create the database:
   ```sql
   CREATE DATABASE qa_training;
   ```

2. Update `QA Training App/application.properties` with your MySQL root password:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=<your-root-password>
   ```

3. Run the app:
   ```bash
   cd "QA Training App"
   java -jar qa-training-app.jar
   ```

4. Verify the login page:
   - UI: `http://localhost:8080/ui/login`
   - Swagger: `http://localhost:8080/swagger-ui/index.html`

Default credentials (from app config):
- Admin: `admin / admin123`
- User: `testuser / test123`

If your assignment document lists different user credentials, override them in `.env`.

## 3) Install automation dependencies

From the `automation/` directory:

```bash
npm install
npx playwright install
```

## 4) Configure environment

Copy the example env file and adjust if needed:

```bash
cp .env.example .env
```

Key values:
- `BASE_URL` (default `http://localhost:8080`)
- `HEADLESS` (true/false)
- `TIMEOUT_MS` (default 10000)

## 5) Run tests

```bash
npm test
```

Headed mode:
```bash
npm run test:headed
```

Reports are generated in `automation/reports/`.

## Notes

- Plant Management scenarios are aligned with `TestCaseDocument__11__v0.1.pdf`:
  - UI: `features/plant-management-ui.feature`
  - API: `features/plant-management-api.feature`
- API tests authenticate via `POST /api/auth/login` and pass the JWT as `Authorization: Bearer <token>`.
- Data setup/cleanup for API tests is automated in hooks (creates categories, plants, and sales as needed).
- Selectors are mapped to the current HTML templates inside the JAR.

## Suggested next steps

- Implement full CRUD scenarios for Categories/Plants/Sales.
- Add Allure reporting if required by your assignment.
