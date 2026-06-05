# Locator Practice — Sauce Demo

The selectors below are updated for the Sauce Demo page using `data-test` where available.
Playwright is configured with `testIdAttribute: "data-test"` in `playwright.config.ts`, so `page.getByTestId("...")` resolves to `data-test="..."`.

1. Shopping cart link/icon
   - CSS: `a[data-test="shopping-cart-link"]`
   - XPath: `//a[@data-test="shopping-cart-link"]`
   - Playwright: `page.getByTestId('shopping-cart-link')`

2. All "Add to cart" buttons
   - CSS: `button[data-test^="add-to-cart"]`
   - XPath: `//button[starts-with(@data-test, "add-to-cart")]`
   - Playwright: `page.getByTestId(/add-to-cart-/)`

3. Sort dropdown
   - CSS: `select[data-test="product-sort-container"]`
   - XPath: `//select[@data-test="product-sort-container"]`
   - Playwright: `page.getByTestId('product-sort-container')`

4. All product images
   - CSS: `img[data-test$="-img"]`
   - XPath: `//img[ends-with(@data-test, "-img")]`
   - Playwright: `page.getByTestId(/-img$/)`

5. Items whose price contains "$15.99"
   - CSS: `div[data-test="inventory-item-price"]`
   - XPath: `//div[@data-test="inventory-item-price" and normalize-space()="$15.99"]`
   - Playwright: `page.locator('[data-test="inventory-item-price"]', { hasText: '$15.99' })`

6. "Add to cart" button for "Sauce Labs Backpack"
   - CSS / attribute: `button[data-test="add-to-cart-sauce-labs-backpack"]`
   - XPath: `//button[@data-test="add-to-cart-sauce-labs-backpack"]`
   - Playwright: `page.getByTestId('add-to-cart-sauce-labs-backpack')`

7. "Remove" button after adding "Sauce Labs Onesie"
   - CSS / attribute: `button[data-test="remove-sauce-labs-onesie"]`
   - XPath: `//button[@data-test="remove-sauce-labs-onesie"]`
   - Playwright: `page.getByTestId('remove-sauce-labs-onesie')`

8. All buttons with `data-test` starting with "add-to-cart"
   - CSS: `button[data-test^="add-to-cart"]`
   - XPath: `//button[starts-with(@data-test, "add-to-cart")]`
   - Playwright: `page.getByTestId(/add-to-cart-/)`

9. All product names that do NOT contain "Sauce Labs"
   - CSS: `div[data-test="inventory-item-name"]`
   - XPath: `//div[@data-test="inventory-item-name" and not(contains(normalize-space(), "Sauce Labs"))]`
   - Playwright: `page.getByTestId('inventory-item-name').filter({ hasNotText: 'Sauce Labs' })`

10. Product image with partial alt text match
   - CSS: `img[data-test$="-img"][alt*="Backpack"]`
   - XPath: `//img[ends-with(@data-test, "-img") and contains(@alt, "Backpack")]`
   - Playwright: `page.locator('img[data-test$="-img"][alt*="Backpack"]')`

