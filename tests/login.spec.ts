import { test, expect } from '../fixtures/test';

const SECRET_SAUCE = 'secret_sauce';

test.describe('SauceDemo login', () => {
  test('valid credentials land on the inventory page', async ({ loginPage, page }) => {
    await loginPage.loginAs('standard_user', SECRET_SAUCE);
    await expect(page).toHaveURL(/.*inventory\.html/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('locked-out user sees the lockout error', async ({ loginPage }) => {
    await loginPage.loginAs('locked_out_user', SECRET_SAUCE);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      'Sorry, this user has been locked out.',
    );
  });

  test('invalid credentials show an error and stay on the login page', async ({
    loginPage,
    page,
  }) => {
    await loginPage.loginAs('standard_user', 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText(
      'Username and password do not match',
    );
    await expect(page).not.toHaveURL(/.*inventory\.html/);
  });

  test('self-healing locator recovers the username field', async ({ loginPage }) => {
    // Uses the fallback selector chain instead of the primary data-test hook.
    const username = await loginPage.healedUsernameInput();
    await expect(username).toBeVisible();
    await username.fill('standard_user');
  });
});
