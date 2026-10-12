import { Locator, Page } from '@playwright/test';

/**
 * Lightweight self-healing locator pattern.
 *
 * Tries each selector strategy in order and returns the first locator that
 * becomes visible within the timeout. This absorbs small DOM changes (e.g. a
 * `data-test` attribute renamed to an `id`) without rewriting every test.
 *
 * For production suites this is a starting point — teams often layer on
 * persistent healing logs / LLM-assisted suggestions. Here it stays
 * dependency-free and deterministic: first visible selector wins.
 *
 * @param page      The Playwright page to search.
 * @param selectors Ordered selector strategies, most reliable first.
 * @param timeoutMs Max wait per selector before trying the next.
 * @throws Error listing every attempted selector when none matched.
 */
export async function healLocator(
  page: Page,
  selectors: string[],
  timeoutMs = 5_000,
): Promise<Locator> {
  const attempted: string[] = [];

  for (const selector of selectors) {
    attempted.push(selector);
    const locator = page.locator(selector);
    try {
      await locator.first().waitFor({ state: 'visible', timeout: timeoutMs });
      return locator.first();
    } catch {
      // Not visible with this strategy — try the next one.
    }
  }

  throw new Error(
    `Self-healing failed: none of the selectors matched a visible element.\n` +
      `Attempted:\n${attempted.map((s) => `  - ${s}`).join('\n')}`,
  );
}
