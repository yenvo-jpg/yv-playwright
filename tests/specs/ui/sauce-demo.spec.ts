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
        // Exercise 1-10: Validates all CSS, XPath, and Playwright locators work correctly
        // Supports: Locator Practice assignment requirements
        test("Inventory selectors exercise", async ({ signInPage, inventoryPage }) => {
            // Setup: Navigate and login to access inventory page
            await signInPage.navigate();
            await signInPage.loginAsDefaultUser();
            await signInPage.expectLoginSuccess();
            await inventoryPage.waitForInventoryPage();

            // Locator #1: Validates shopping cart link is visible and accessible
            await expect(inventoryPage.elements.shoppingCartLink()).toBeVisible();
            
            // Locator #2: Validates all 6 "Add to cart" buttons are rendered on inventory page
            await expect(inventoryPage.elements.allAddToCartButtons()).toHaveCount(6);
            
            // Locator #3: Validates sort dropdown container is visible
            await expect(inventoryPage.elements.sortDropdown()).toBeVisible();
            
            // Locator #4: Validates all 6 product images are displayed
            await expect(inventoryPage.elements.productImages()).toHaveCount(6);
            
            // Locator #5: Validates exactly 2 products have price $15.99 (Bolt T-Shirt, Test.allTheThings T-Shirt)
            await expect(inventoryPage.elements.price15_99()).toHaveCount(2);
            
            // Locator #6: Validates "Add to cart" button for Sauce Labs Backpack is visible
            await expect(inventoryPage.elements.addSauceLabsBackpackButton()).toBeVisible();
            
            // Locator #7: Validates all 6 buttons with data-test attribute for add-to-cart exist
            await expect(inventoryPage.elements.addToCartDataTestButtons()).toHaveCount(6);

            // Locator #8: Adds Sauce Labs Onesie to cart, then validates the "Remove" button appears
            await inventoryPage.addSauceLabsOnesieToCart();
            await expect(inventoryPage.elements.removeSauceLabsOnesieButton()).toBeVisible();

            // Locator #9: Validates no products contain "No Sauce Labs" in their name (all should be Sauce Labs or Test.allTheThings)
            await expect(inventoryPage.elements.productNamesNoSauceLabs()).toHaveCount(0);
            
            // Locator #10: Validates product images with alt text partially matching expected pattern
            await expect(inventoryPage.elements.productImageByAltPartial()).toHaveCount(1);
        });
    });

    test.describe("Inventory Sort Scenarios", () => {
        // Scenario 1: Validates default sort order on first login
        // Supports: Initial state validation, ensuring sort defaults to "Name (A to Z)"
        test("Default sort state after login", async ({ signInPage, inventoryPage }) => {
            // Setup: Navigate and login to establish session
            await signInPage.navigate();
            await signInPage.loginAsDefaultUser();
            await signInPage.expectLoginSuccess();
            await inventoryPage.waitForInventoryPage();

            // Verify: Check that page elements are ready (cart and sort dropdown)
            await expect(inventoryPage.elements.shoppingCartLink()).toBeVisible();
            await expect(inventoryPage.elements.sortDropdown()).toBeVisible();

            // Validate: Assert that the selected sort option is "Name (A to Z)" (default)
            const selectedSort = await inventoryPage.getSelectedSortOptionText();
            expect(selectedSort?.trim()).toBe("Name (A to Z)");

            // Validate: Assert that products are listed in alphabetical order as expected
            const productNames = await inventoryPage.getProductNames();
            expect(productNames).toEqual(expectedProductNames);
        });

        // Scenario 2: Validates that sort preference resets after logout and re-login
        // Supports: Session management, ensuring user preferences don't persist across logins
        test("Sort resets after logout and re-login", async ({ signInPage, inventoryPage }) => {
            // Setup: Navigate and login to inventory page
            await signInPage.navigate();
            await signInPage.loginAsDefaultUser();
            await signInPage.expectLoginSuccess();
            await inventoryPage.waitForInventoryPage();

            // Action: Change sort order from default to reverse alphabetical "Name (Z to A)"
            await inventoryPage.selectSortOption("Name (Z to A)");
            
            // Action: Logout via hamburger menu
            await inventoryPage.openHamburgerMenu();
            await inventoryPage.logout();

            // Verify: Confirm login page is displayed after logout
            await expect(signInPage.elements.loginButton()).toBeVisible();

            // Action: Re-login with same credentials
            await signInPage.navigate();
            await signInPage.login(Env.MY_USERNAME, Env.PASSWORD);
            await inventoryPage.waitForInventoryPage();

            // Validate: Assert that sort preference has reset to default "Name (A to Z)"
            const selectedSort = await inventoryPage.getSelectedSortOptionText();
            expect(selectedSort?.trim()).toBe("Name (A to Z)");

            // Validate: Assert products are back in default alphabetical order
            const productNames = await inventoryPage.getProductNames();
            expect(productNames).toEqual(expectedProductNames);
        });

        // Scenario 3: Validates sort functionality with items in cart and equal-price product ordering
        // Supports: Complex sorting scenarios, cart persistence, equal-price item stability
        test("Sort works correctly with items in cart and equal-price products maintain stable order", async ({ signInPage, inventoryPage }) => {
            // Setup: Navigate and login to inventory page
            await signInPage.navigate();
            await signInPage.loginAsDefaultUser();
            await signInPage.expectLoginSuccess();
            await inventoryPage.waitForInventoryPage();

            // Action: Add two items to cart (Sauce Labs Backpack and Sauce Labs Onesie)
            await inventoryPage.clickAddToCartByName("Sauce Labs Backpack");
            await inventoryPage.clickAddToCartByName("Sauce Labs Onesie");
            
            // Verify: Confirm cart badge displays correct count
            expect(await inventoryPage.getCartBadgeCount()).toBe("2");

            // Action: Sort products by price from highest to lowest
            await inventoryPage.selectSortOption("Price (high to low)");

            // Validate: Assert products are sorted in descending price order
            const entries = await inventoryPage.getProductEntries();
            const prices = entries.map((entry) => entry.price);
            expect(prices).toEqual([...prices].sort((a, b) => b - a));

            // Verify: Confirm cart count persists after sort change
            expect(await inventoryPage.getCartBadgeCount()).toBe("2");
            
            // Verify: Confirm cart items show "Remove" button and non-cart items show "Add to cart"
            expect(await inventoryPage.getButtonTextByName("Sauce Labs Backpack")).toBe("Remove");
            expect(await inventoryPage.getButtonTextByName("Sauce Labs Onesie")).toBe("Remove");
            entries.forEach((entry) => {
                if (!addedProducts.includes(entry.name)) {
                    expect(entry.button).toBe("Add to cart");
                }
            });

            // Action: Sort products by price from lowest to highest
            await inventoryPage.selectSortOption("Price (low to high)");

            // Validate: Assert that equal-price products (both $15.99) maintain stable relative order
            // Bolt T-Shirt should appear before Test.allTheThings T-Shirt (stable sort)
            const lowToHighNames = await inventoryPage.getProductNames();
            const boltIndex = lowToHighNames.indexOf("Sauce Labs Bolt T-Shirt");
            const testIndex = lowToHighNames.indexOf("Test.allTheThings() T-Shirt (Red)");
            expect(boltIndex).toBeLessThan(testIndex);

            // Action: Sort back to high-to-low to verify ordering is consistent
            await inventoryPage.selectSortOption("Price (high to low)");

            // Validate: Assert equal-price products maintain stable relative order in reverse direction
            const highToLowNames = await inventoryPage.getProductNames();
            expect(highToLowNames.indexOf("Sauce Labs Bolt T-Shirt")).toBeLessThan(
                highToLowNames.indexOf("Test.allTheThings() T-Shirt (Red)")
            );
        });
    });
});
