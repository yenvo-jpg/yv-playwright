// import { test } from 'src/fixtures/base.fixture';
import Env from "settings/env/env.global";
import { test, expect } from "settings/fixtures/ui.fixture";

test("Sauce Demo inventory selectors exercise", async ({ signInPage, inventoryPage }) => {
    await signInPage.login(Env.MY_USERNAME, Env.PASSWORD);
    await inventoryPage.waitForInventoryPage();

    await expect(inventoryPage.elements.shoppingCartLink()).toBeVisible();
    await expect(inventoryPage.elements.allAddToCartButtons()).toHaveCount(6);
    await expect(inventoryPage.elements.sortDropdown()).toBeVisible();
    await expect(inventoryPage.elements.productImages()).toHaveCount(6);
    await expect(inventoryPage.elements.price15_99()).toHaveCount(2);
    await expect(inventoryPage.elements.addSauceLabsBackpackButton()).toBeVisible();
    await expect(inventoryPage.elements.addToCartDataTestButtons()).toHaveCount(6);

    await inventoryPage.addSauceLabsOnesieToCart();
    await expect(inventoryPage.elements.removeSauceLabsOnesieButton()).toBeVisible();

    await expect(inventoryPage.elements.productNamesNoSauceLabs()).toHaveCount(0);
    await expect(inventoryPage.elements.productImageByAltPartial()).toHaveCount(1);
});