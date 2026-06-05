import Env from "settings/env/env.global";
import { test, expect } from "settings/fixtures/ui.fixture";

const expectedProductNames = [
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
    "Sauce Labs Bolt T-Shirt",
    "Sauce Labs Fleece Jacket",
    "Sauce Labs Onesie",
    "Test.allTheThings() T-Shirt (Red)",
];

const addedProducts = ["Sauce Labs Backpack", "Sauce Labs Onesie"];

test.describe("Sauce Demo Inventory Tests", () => {
    test.describe("Locator Practice", () => {
        test("Inventory selectors exercise", async ({ signInPage, inventoryPage }) => {
            await signInPage.navigate();
            await signInPage.loginAsDefaultUser();
            await signInPage.expectLoginSuccess();
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
    });

    test.describe("Inventory Sort Scenarios", () => {
        test("Default sort state after login", async ({ signInPage, inventoryPage }) => {
            await signInPage.navigate();
            await signInPage.loginAsDefaultUser();
            await signInPage.expectLoginSuccess();
            await inventoryPage.waitForInventoryPage();

            await expect(inventoryPage.elements.shoppingCartLink()).toBeVisible();
            await expect(inventoryPage.elements.sortDropdown()).toBeVisible();

            const selectedSort = await inventoryPage.getSelectedSortOptionText();
            expect(selectedSort?.trim()).toBe("Name (A to Z)");

            const productNames = await inventoryPage.getProductNames();
            expect(productNames).toEqual(expectedProductNames);
        });

        test("Sort resets after logout and re-login", async ({ signInPage, inventoryPage }) => {
            await signInPage.navigate();
            await signInPage.loginAsDefaultUser();
            await signInPage.expectLoginSuccess();
            await inventoryPage.waitForInventoryPage();

            await inventoryPage.selectSortOption("Name (Z to A)");
            await inventoryPage.openHamburgerMenu();
            await inventoryPage.logout();

            await expect(signInPage.elements.loginButton()).toBeVisible();

            await signInPage.navigate();
            await signInPage.login(Env.MY_USERNAME, Env.PASSWORD);
            await inventoryPage.waitForInventoryPage();

            const selectedSort = await inventoryPage.getSelectedSortOptionText();
            expect(selectedSort?.trim()).toBe("Name (A to Z)");

            const productNames = await inventoryPage.getProductNames();
            expect(productNames).toEqual(expectedProductNames);
        });

        test("Sort works correctly with items in cart and equal-price products maintain stable order", async ({ signInPage, inventoryPage }) => {
            await signInPage.navigate();
            await signInPage.loginAsDefaultUser();
            await signInPage.expectLoginSuccess();
            await inventoryPage.waitForInventoryPage();

            await inventoryPage.clickAddToCartByName("Sauce Labs Backpack");
            await inventoryPage.clickAddToCartByName("Sauce Labs Onesie");
            expect(await inventoryPage.getCartBadgeCount()).toBe("2");

            await inventoryPage.selectSortOption("Price (high to low)");

            const entries = await inventoryPage.getProductEntries();
            const prices = entries.map((entry) => entry.price);
            expect(prices).toEqual([...prices].sort((a, b) => b - a));

            expect(await inventoryPage.getCartBadgeCount()).toBe("2");
            expect(await inventoryPage.getButtonTextByName("Sauce Labs Backpack")).toBe("Remove");
            expect(await inventoryPage.getButtonTextByName("Sauce Labs Onesie")).toBe("Remove");
            entries.forEach((entry) => {
                if (!addedProducts.includes(entry.name)) {
                    expect(entry.button).toBe("Add to cart");
                }
            });

            await inventoryPage.selectSortOption("Price (low to high)");

            const lowToHighNames = await inventoryPage.getProductNames();
            const boltIndex = lowToHighNames.indexOf("Sauce Labs Bolt T-Shirt");
            const testIndex = lowToHighNames.indexOf("Test.allTheThings() T-Shirt (Red)");
            expect(boltIndex).toBeLessThan(testIndex);

            await inventoryPage.selectSortOption("Price (high to low)");

            const highToLowNames = await inventoryPage.getProductNames();
            expect(highToLowNames.indexOf("Sauce Labs Bolt T-Shirt")).toBeLessThan(
                highToLowNames.indexOf("Test.allTheThings() T-Shirt (Red)")
            );
        });
    });
});
