const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://www.saucedemo.com/');

  await page.fill('[data-test="username"], input[id="user-name"], input[name="user-name"]', 'standard_user');
  await page.fill('[data-test="password"], input[id="password"], input[name="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"], button[id="login-button"], button[name="login-button"]');

  await page.waitForSelector('.inventory_list, #inventory_container, .inventory_item', { timeout: 15000 });

  const inventoryContainer = await page.locator('.inventory_list, #inventory_container').first();
  const inventoryHtml = await inventoryContainer.evaluate((node) => node.outerHTML);

  const dataTests = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-test]')).map((el) => ({
      tag: el.tagName.toLowerCase(),
      testId: el.getAttribute('data-test'),
      outerHTML: el.outerHTML.slice(0, 400),
    }));
  });

  console.log('=== Inventory element snapshot ===');
  console.log(inventoryHtml.slice(0, 2000));
  console.log('\n=== Found data-test attributes ===');
  console.log(JSON.stringify(dataTests, null, 2));

  await browser.close();
})();