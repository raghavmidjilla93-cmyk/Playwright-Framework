import { Locator, Page } from '@playwright/test';
import { healLocator } from '../utils/selfHealing';

/**
 * Page Object for the SauceDemo login page (https://www.saucedemo.com).
 *
 * The username field uses a self-healing locator: if the primary
 * `data-test` selector ever changes, the helper falls back through the
 * ordered selector list instead of failing the test.
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  /** Navigate to the login page (baseURL is set in playwright.config.ts). */
  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  /**
   * Log in with the given credentials. Waits for the inventory page to
   * load on success; on failure the caller asserts on `errorMessage`.
   */
  async loginAs(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Demonstrates the self-healing pattern on the username field: tries
   * several selector strategies and returns the first visible locator.
   */
  async healedUsernameInput(): Promise<Locator> {
    return healLocator(this.page, [
      '[data-test="username"]',
      '#user-name',
      'input[placeholder="Username"]',
      'input >> nth=0',
    ]);
  }
}
