import { test, expect } from '@playwright/test';

const API_BASE = 'https://jsonplaceholder.typicode.com';

/**
 * API contract tests using Playwright's built-in APIRequestContext.
 * These run without a browser — pure HTTP assertions against the
 * JSONPlaceholder fake REST API.
 */
test.describe('JSONPlaceholder API', () => {
  test('GET /posts/1 returns 200 with the expected shape', async ({ request }) => {
    const started = Date.now();
    const response = await request.get(`${API_BASE}/posts/1`);
    const elapsedMs = Date.now() - started;

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(elapsedMs).toBeLessThan(5_000); // response-time SLA

    const body = await response.json();
    expect(body).toMatchObject({
      userId: expect.any(Number),
      id: 1,
      title: expect.any(String),
      body: expect.any(String),
    });
  });

  test('GET /posts/1 title is a non-empty string', async ({ request }) => {
    const response = await request.get(`${API_BASE}/posts/1`);
    const body = await response.json();

    expect(typeof body.title).toBe('string');
    expect(body.title.length).toBeGreaterThan(0);
  });

  test('POST /posts returns 201 and echoes the payload', async ({ request }) => {
    const payload = { title: 'playwright', body: 'api test', userId: 7 };

    const response = await request.post(`${API_BASE}/posts`, { data: payload });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toMatchObject(payload);
    expect(body.id).toBeDefined();
  });

  test('GET /posts/9999 (missing) returns 404', async ({ request }) => {
    const response = await request.get(`${API_BASE}/posts/9999`);
    expect(response.status()).toBe(404);
  });
});
