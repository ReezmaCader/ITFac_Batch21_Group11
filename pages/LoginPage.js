class LoginPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = 'input[name="username"]';
        this.passwordInput = 'input[name="password"]';
        this.loginButton = 'button[type="submit"]';
    }

    async navigate() {
        await this.page.goto('http://localhost:8080/ui/login');
    }

    async login(username, password) {
        await this.page.fill(this.usernameInput, username);
        await this.page.fill(this.passwordInput, password);

        await Promise.all([
            this.page.waitForURL('**/ui/dashboard'), 
            this.page.click(this.loginButton)
        ]);
    }
}
module.exports = { LoginPage };