import { test as base } from "@playwright/test";
import { SignInPage } from "page-objects/pages/sign-in.page";


type PageObjects = {
    signInPage: SignInPage;
};

export const test = base.extend<PageObjects>({
    signInPage: async ({ page }, use) => {
        await use(new SignInPage(page));
    },
});

export const expect = test.expect;
