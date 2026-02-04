# ITFac_Batch21_Group15

Test automation repository for the ITQA module

## Playwright

First do a git pull and get the updates

Then do a npm install (So playeright and needed dependecies will be installed)

Create separate pages for your specific UI pages. Always yse POM model
(for login, you can use the already available model)

Write your admin test cases under tests/admin and user test cases under tests/user folder and end them with .spec.js format (Refer to the test case files written by me)

I have merged my branch (Ansak) to main so you all can have a look and get an understanding

Create a branch for yourselves and add your test files under admin and user, once done update in the group so I will merge to main

### Run all:
npx playwright test

### Run only user tests:
npx playwright test tests/user

### Run only one file:
npx playwright test plant-list-user.spec.js

## Cucumber

Will update soon