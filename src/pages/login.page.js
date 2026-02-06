const { env } = require('../support/env');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorAlert = page.locator('.alert-danger');
  }

  async goto() {
    await this.page.goto(`${env.baseUrl}/ui/login`, { waitUntil: 'domcontentloaded' });
  }

  async submit() {
    await this.loginButton.click();
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getUsernameValidationMessage() {
    return this.usernameInput.locator('xpath=following-sibling::div').textContent();
  }

  async getPasswordValidationMessage() {
    return this.passwordInput.locator('xpath=following-sibling::div').textContent();
  }

  async getInvalidCredentialsMessage() {
    return this.errorAlert.textContent();
  }
}

module.exports = { LoginPage };
