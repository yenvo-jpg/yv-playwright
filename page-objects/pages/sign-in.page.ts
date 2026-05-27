import { Page } from "@playwright/test";
import { Wait } from "settings/config/timeout.config";
import Env from "settings/env/env.global";

export class SignInPage {
    constructor(protected page: Page) {}

    elements = {
        usernameInput: () => this.page.getByRole("textbox", { name: "Username" }),
        passwordInput: () => this.page.getByRole("textbox", { name: "Password" }),
        loginButton: () => this.page.getByRole("button", { name: "Login" }),
        errorMessage: () => this.page.getByTestId("error"),
    };

    async navigate() {
        await this.page.goto(Env.WEB_URL);
    }

    async login(username: string, password: string) {
        await this.elements.usernameInput().fill(username);
        await this.elements.passwordInput().fill(password);
        await this.elements.loginButton().click();
    }

    async loginAsDefaultUser() {
        await this.login(Env.MY_USERNAME, Env.PASSWORD);
    }

    async expectLoginSuccess() {
        await this.page.waitForURL("**/inventory.html");
    }
}