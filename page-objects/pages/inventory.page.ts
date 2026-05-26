import { Page } from "@playwright/test";
import { Wait } from "settings/config/timeout.config";

export class InventoryPage {
    constructor(protected page: Page) {}

    elements = {
        shoppingCartLink: () => this.page.locator('.shopping_cart_link'),
        allAddToCartButtons: () => this.page.locator('button.btn_inventory:has-text("Add to cart")'),
        sortDropdown: () => this.page.locator('.product_sort_container'),
        productImages: () => this.page.locator('.inventory_item_img img'),
        price15_99: () => this.page.locator('//div[contains(@class, "inventory_item_price") and contains(normalize-space(.), "$15.99")]'),
        addSauceLabsBackpackButton: () => this.page.locator('button[data-test="add-to-cart-sauce-labs-backpack"]'),
        removeSauceLabsOnesieButton: () => this.page.locator('button[data-test="remove-sauce-labs-onesie"]'),
        addToCartDataTestButtons: () => this.page.locator('button[data-test^="add-to-cart"]'),
        productNamesNoSauceLabs: () => this.page.locator('//div[@class="inventory_item_name" and not(contains(text(), "Sauce Labs"))]'),
        productImageByAltPartial: () => this.page.locator('//img[contains(@alt, "Backpack")]'),
        inventoryList: () => this.page.locator('.inventory_list'),
        inventoryItemNames: () => this.page.locator('.inventory_item_name'),
        selectedSortOption: () => this.page.locator('.product_sort_container option:checked'),
        hamburgerMenuButton: () => this.page.locator('#react-burger-menu-btn'),
        logoutLink: () => this.page.locator('#logout_sidebar_link'),
        cartBadge: () => this.page.locator('.shopping_cart_badge'),
        inventoryItems: () => this.page.locator('.inventory_item'),
    };

    async waitForInventoryPage() {
        await this.elements.inventoryList().waitFor({ timeout: Wait.LONG });
    }

    async addSauceLabsOnesieToCart() {
        await this.page.locator('button[data-test="add-to-cart-sauce-labs-onesie"]').click();
    }

    async clickAddToCartByName(name: string) {
        const item = this.page.locator('.inventory_item', {
            has: this.page.locator('.inventory_item_name', { hasText: name }),
        });
        await item.locator('button').click();
    }

    async getButtonTextByName(name: string) {
        const item = this.page.locator('.inventory_item', {
            has: this.page.locator('.inventory_item_name', { hasText: name }),
        });
        return (await item.locator('button').textContent())?.trim();
    }

    async openHamburgerMenu() {
        await this.elements.hamburgerMenuButton().click();
    }

    async logout() {
        await this.elements.logoutLink().click();
    }

    async getCartBadgeCount() {
        return (await this.elements.cartBadge().textContent())?.trim() ?? "0";
    }

    async selectSortOption(label: string) {
        await this.elements.sortDropdown().selectOption({ label });
    }

    async getProductNames() {
        return await this.elements.inventoryItemNames().allTextContents();
    }

    async getProductEntries() {
        const entries = [] as Array<{ name: string; price: number; button: string }>;
        const itemCount = await this.elements.inventoryItems().count();
        for (let i = 0; i < itemCount; i += 1) {
            const item = this.elements.inventoryItems().nth(i);
            const name = (await item.locator('.inventory_item_name').textContent())?.trim() ?? "";
            const priceText = (await item.locator('.inventory_item_price').textContent())?.trim() ?? "";
            const button = (await item.locator('button').textContent())?.trim() ?? "";
            const price = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;
            entries.push({ name, price, button });
        }
        return entries;
    }

    async getSelectedSortOptionText() {
        return await this.elements.selectedSortOption().textContent();
    }
}
