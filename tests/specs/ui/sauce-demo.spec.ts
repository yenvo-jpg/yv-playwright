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

// This test is defined outside the grouped inventory scenarios.
// Support: checks that all key inventory selectors are available and working.
test("Inventory selectors exercise", async ({ signInPage, inventoryPage }) => {
    // Setup: open the site and login with default user
    await signInPage.navigate();
    await signInPage.loginAsDefaultUser();
    await signInPage.expectLoginSuccess();
    await inventoryPage.waitForInventoryPage();

    // Verification: header and product UI selectors are visible and present
    await expect(inventoryPage.elements.shoppingCartLink()).toBeVisible();
    await expect(inventoryPage.elements.allAddToCartButtons()).toHaveCount(6);
    await expect(inventoryPage.elements.sortDropdown()).toBeVisible();
    await expect(inventoryPage.elements.productImages()).toHaveCount(6);
    await expect(inventoryPage.elements.price15_99()).toHaveCount(2);
    await expect(inventoryPage.elements.addSauceLabsBackpackButton()).toBeVisible();
    await expect(inventoryPage.elements.addToCartDataTestButtons()).toHaveCount(6);

    // Action: add a product to cart and verify the remove button appears
    await inventoryPage.addSauceLabsOnesieToCart();
    await expect(inventoryPage.elements.removeSauceLabsOnesieButton()).toBeVisible();

    // Validation: ensure selector filters work correctly for product names and image alt text
    await expect(inventoryPage.elements.productNamesNoSauceLabs()).toHaveCount(0);
    await expect(inventoryPage.elements.productImageByAltPartial()).toHaveCount(1);
});


test.describe("Sauce Demo Inventory Tests", () => {
    // Scenario: Validate default sort order after login
    // Support: confirms inventory defaults to Name (A to Z) on first login
    test("Default sort state after login", async ({ signInPage, inventoryPage }) => {
        // Setup: login and wait for inventory page to load
        await signInPage.navigate();
        await signInPage.loginAsDefaultUser();
        await signInPage.expectLoginSuccess();
        await inventoryPage.waitForInventoryPage();

        // Verify main inventory page elements are present before checking sort behavior
        await expect(inventoryPage.elements.shoppingCartLink()).toBeVisible();
        await expect(inventoryPage.elements.sortDropdown()).toBeVisible();

        // Check selected sort option text
        const selectedSort = await inventoryPage.getSelectedSortOptionText();
        expect(selectedSort?.trim()).toBe("Name (A to Z)");

        // Assert product order matches expected alphabetical list
        const productNames = await inventoryPage.getProductNames();
        expect(productNames).toEqual(expectedProductNames);
    });

    // Scenario: Validate sort resets to default after logout and re-login
    // Support: ensures user sort preference does not persist across sessions
    test("Sort resets after logout and re-login", async ({ signInPage, inventoryPage }) => {
        // Setup: login and navigate to inventory
        await signInPage.navigate();
        await signInPage.loginAsDefaultUser();
        await signInPage.expectLoginSuccess();
        await inventoryPage.waitForInventoryPage();

        // Action: change sort order and then logout
        await inventoryPage.selectSortOption("Name (Z to A)");
        await inventoryPage.openHamburgerMenu();
        await inventoryPage.logout();

        // Verify logout returns to login page
        await expect(signInPage.elements.loginButton()).toBeVisible();

        // Action: re-login with same credentials
        await signInPage.navigate();
        await signInPage.login(Env.MY_USERNAME, Env.PASSWORD);
        await inventoryPage.waitForInventoryPage();

        // Validation: sort order resets to default on new login
        const selectedSort = await inventoryPage.getSelectedSortOptionText();
        expect(selectedSort?.trim()).toBe("Name (A to Z)");

        // Validation: product list returns to expected default order
        const productNames = await inventoryPage.getProductNames();
        expect(productNames).toEqual(expectedProductNames);
    });

    // Scenario: Validate sorting with items in cart and stable ordering for equal-price products
    // Support: verifies cart persistence, sort correctness, and stable order for same-price items
    test("Sort works correctly with items in cart and equal-price products maintain stable order", async ({ signInPage, inventoryPage }) => {
        // Setup: login and confirm inventory page is loaded
        await signInPage.navigate();
        await signInPage.loginAsDefaultUser();
        await signInPage.expectLoginSuccess();
        await inventoryPage.waitForInventoryPage();

        // Action: add two products to cart and verify the cart badge count
        await inventoryPage.clickAddToCartByName("Sauce Labs Backpack");
        await inventoryPage.clickAddToCartByName("Sauce Labs Onesie");
        expect(await inventoryPage.getCartBadgeCount()).toBe("2");

        // Action: sort by highest price first
        await inventoryPage.selectSortOption("Price (high to low)");

        // Validation: product prices are sorted descending
        const entries = await inventoryPage.getProductEntries();
        const prices = entries.map((entry) => entry.price);
        expect(prices).toEqual([...prices].sort((a, b) => b - a));

        // Verification: cart items remain in cart and buttons update correctly
        expect(await inventoryPage.getCartBadgeCount()).toBe("2");
        expect(await inventoryPage.getButtonTextByName("Sauce Labs Backpack")).toBe("Remove");
        expect(await inventoryPage.getButtonTextByName("Sauce Labs Onesie")).toBe("Remove");
        entries.forEach((entry) => {
            if (!addedProducts.includes(entry.name)) {
                expect(entry.button).toBe("Add to cart");
            }
        });

        // Action: sort by lowest price first
        await inventoryPage.selectSortOption("Price (low to high)");

        // Validation: equal-price products maintain stable relative order
        const lowToHighNames = await inventoryPage.getProductNames();
        const boltIndex = lowToHighNames.indexOf("Sauce Labs Bolt T-Shirt");
        const testIndex = lowToHighNames.indexOf("Test.allTheThings() T-Shirt (Red)");
        expect(boltIndex).toBeLessThan(testIndex);

        // Action: sort back to high-to-low for consistency check
        await inventoryPage.selectSortOption("Price (high to low)");

        // Validation: stable order still preserved after second sort change
        const highToLowNames = await inventoryPage.getProductNames();
        expect(highToLowNames.indexOf("Sauce Labs Bolt T-Shirt")).toBeLessThan(
            highToLowNames.indexOf("Test.allTheThings() T-Shirt (Red)")
        );
    });
});
