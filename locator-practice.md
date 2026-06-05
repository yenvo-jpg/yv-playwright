# Locator Practice — Sauce Demo

The selectors below are used to complete the 10 locator exercises (CSS / XPath) for the Sauce Demo Inventory page.

1. Shopping cart link/icon
   - CSS: `.shopping_cart_link`
   - XPath: `//a[contains(@class, "shopping_cart_link")]`
   - Playwright: `page.locator('.shopping_cart_link')`

2. All "Add to cart" buttons
   - CSS: `button.btn_inventory`
   - XPath: `//button[contains(normalize-space(.), "Add to cart")]`
   - Playwright: `page.locator('button.btn_inventory:has-text("Add to cart")')`

3. Sort dropdown
   - CSS: `.product_sort_container`
   - XPath: `//select[contains(@class, "product_sort_container")]`
   - Playwright: `page.locator('.product_sort_container')`

4. All product images
   - CSS: `.inventory_item_img img`
   - XPath: `//div[@class="inventory_item_img"]//img` or `//img[contains(@class, "inventory_item_img")]`
   - Playwright: `page.locator('.inventory_item_img img')`

5. Items whose price contains "$15.99"
   - XPath: `//div[contains(@class, "inventory_item_price") and contains(normalize-space(.), "$15.99")]`
   - Playwright: `page.locator('//div[contains(@class, "inventory_item_price") and contains(normalize-space(.), "$15.99")]')`

6. "Add to cart" button for "Sauce Labs Backpack"
   - CSS / attribute: `button[data-test="add-to-cart-sauce-labs-backpack"]`
   - XPath: `//button[@data-test="add-to-cart-sauce-labs-backpack"]`
   - Playwright: `page.locator('button[data-test="add-to-cart-sauce-labs-backpack"]')`

7. "Remove" button after adding "Sauce Labs Onesie"
   - CSS / attribute: `button[data-test="remove-sauce-labs-onesie"]`
   - XPath: `//button[@data-test="remove-sauce-labs-onesie"]`
   - Playwright: `page.locator('button[data-test="remove-sauce-labs-onesie"]')`

8. All buttons with `data-test` starting with "add-to-cart"
   - CSS: `button[data-test^="add-to-cart"]`
   - XPath: `//button[starts-with(@data-test, "add-to-cart")]`
   - Playwright: `page.locator('button[data-test^="add-to-cart"]')`

9. All product names that do NOT contain "Sauce Labs"
   - XPath: `//div[@class="inventory_item_name" and not(contains(text(), "Sauce Labs"))]`
   - Playwright: `page.locator('//div[@class="inventory_item_name" and not(contains(text(), "Sauce Labs"))]')`

10. Select a product's image by matching alt text partially
    - CSS: `img[alt*="Backpack"]`
    - XPath: `//img[contains(@alt, "Backpack")]`
    - Playwright: `page.locator('//img[contains(@alt, "Backpack")]')`

Notes:
- Some selectors use Playwright-specific syntax (for example `:has-text()`), but equivalent CSS/XPath are also listed.
- This file reflects the locators currently used in `page-objects/pages/inventory.page.ts`.
