import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

const STANDARD_USER = 'standard_user';
const STANDARD_PASSWORD = 'secret_sauce';

type Fixtures = {
  /** Page Object for the login screen (fresh, not logged in). */
  loginPage: LoginPage;
  /** Page Object for the inventory screen, pre-authenticated via UI login. */
  inventoryPage: InventoryPage;
};

/**
 * Custom fixtures shared across specs.
 *
 * `inventoryPage` performs a UI login once per test and hands the test an
 * InventoryPage already on /inventory.html. For faster suites this could be
 * swapped to storage-state auth; the UI path is kept here so the login flow
 * itself is exercised.
 */
export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  inventoryPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAs(STANDARD_USER, STANDARD_PASSWORD);
    await page.waitForURL('**/inventory.html');
    await use(new InventoryPage(page));
  },
});

export { expect } from '@playwright/test';
