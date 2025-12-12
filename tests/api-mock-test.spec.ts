import { test, expect } from './fixtures/api-mock-fixture';
import type { Page } from '@playwright/test';

// add more assertions
test('mocks user api GET', async ({ page, mockUserApi }: { page: Page; mockUserApi: void }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });

  const data = await page.evaluate(async () => {
    const res = await fetch('/api/users', { method: 'GET' });
    return await res.json();
  }) as { email: string; id: number; first_name: string; last_name: string; avatar: string };
  expect(data.email, 'ERROR: Email should contain @ symbol').toContain('@');
  expect(data, 'ERROR: User data should have id property').toHaveProperty('id');
  expect(data, 'ERROR: User data should have first_name property').toHaveProperty('first_name');
  expect(data, 'ERROR: User data should have last_name property').toHaveProperty('last_name');
  expect(data, 'ERROR: User data should have avatar property').toHaveProperty('avatar');
  expect(data, 'ERROR: User data should have email property').toHaveProperty('email');
  expect(typeof data.id, 'ERROR: User id should be a number').toBe('number');
  expect(typeof data.first_name, 'ERROR: User first_name should be a string').toBe('string');
  expect(typeof data.last_name, 'ERROR: User last_name should be a string').toBe('string');
  expect(typeof data.avatar, 'ERROR: User avatar should be a string').toBe('string');
  expect(typeof data.email, 'ERROR: User email should be a string').toBe('string');
  expect(data.avatar, 'ERROR: Avatar URL should contain https://').toContain('https://');
});

test('mocks user api POST', async ({ page, mockUserApi }: { page: Page; mockUserApi: void }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });

  const response = await page.evaluate(async () => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: 'Jan',
        last_name: 'Kowalski',
        email: 'jan@example.com',
      }),
    });
    return {
      status: res.status,
      data: await res.json(),
    };
  }) as { status: number; data: { id: number; first_name: string; last_name: string; email: string } };

  console.log("response: ", response);
  expect(response.data).toHaveProperty('id');
  expect(typeof response.data.id).toBe('number');
  expect(response.data).toHaveProperty('first_name');
  expect(response.data).toHaveProperty('last_name');
  expect(typeof response.data.first_name).toBe('string');
  expect(typeof response.data.last_name).toBe('string');
  expect(response.status).toBe(201);
  expect(response.data.email, 'ERROR: Email should contain @ symbol').toContain('@');

});
// Mock PATCH and DELETE tests added below
test('mocks user api PATCH', async ({ page, mockUserApi }: { page: Page; mockUserApi: void }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });

  const response = await page.evaluate(async () => {
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'patched@example.com' }),
    });
    return {
      status: res.status,
      data: await res.json(),
    };
  }) as { status: number; data: any };

  expect(response.status).toBe(200);
  expect(response.data, 'ERROR: patched user should have email property').toHaveProperty('email');
  expect(response.data.email, 'ERROR: patched email should be updated').toBe('patched@example.com');
});

//add test to mock delete user (delete user should be in afterAll)
test('mocks user api DELETE', async ({ page, mockUserApi }: { page: Page; mockUserApi: void }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 30000 });

  const response = await page.evaluate(async () => {
    const res = await fetch('/api/users', {
      method: 'DELETE',
    });
    return {
      status: res.status,
      data: await (res.text()),
    };
  }) as { status: number; data: string };

  expect(response.status).toBe(204);
});