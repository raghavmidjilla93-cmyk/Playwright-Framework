import { Locator, Page } from '@playwright/test';

/** Sort options exposed by the inventory page dropdown. */
export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

/**
 * Page Object for the SauceDemo inventory page (/inventory.html).
 */
export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly itemNames: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  /** Click "Add to cart" for the item with the given name. */
  async addItemToCart(itemName: string): Promise<void> {
    const item = this.page.locator('[data-test="inventory-item"]', {
      has: this.page.locator(`[data-test="inventory-item-name"]:has-text("${itemName}")`),
    });
    await item.locator('button:has-text("Add to cart")').click();
  }

  /** Number shown on the cart badge (0 when the badge is hidden). */
  async cartCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) return 0;
    return Number(await this.cartBadge.textContent());
  }

  /** Change the product sort order. */
  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  /** All visible product names in their current display order. */
  async allItemNames(): Promise<string[]> {
    return this.itemNames.allTextContents();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
