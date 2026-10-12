import { test, expect } from '../fixtures/test';

test.describe('SauceDemo inventory', () => {
  test('adding an item updates the cart badge', async ({ inventoryPage }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    expect(await inventoryPage.cartCount()).toBe(1);

    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    expect(await inventoryPage.cartCount()).toBe(2);
  });

  test('sorting Z-A orders product names descending', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('za');

    const names = await inventoryPage.allItemNames();
    expect(names.length).toBeGreaterThan(0);

    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('sorting A-Z orders product names ascending', async ({ inventoryPage }) => {
    await inventoryPage.sortBy('az');

    const names = await inventoryPage.allItemNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });
});
