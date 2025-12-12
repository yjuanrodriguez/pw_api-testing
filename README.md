# API Tests - Homework & Steps

Welcome! This README outlines the homework tasks for the existing API tests in this project and how to run them.

Status: ✅ I implemented the homework: added Create->Patch->Delete and Register/Login tests, extended `APICalls` with PATCH/DELETE/register/login, fixed `DataGenerator`, added `tests/testData/*.json`, and updated mock fixtures for PATCH/DELETE.

This project contains tests using Playwright Test and a simple API wrapper. The test files you will work with are:

- `tests/api-test.spec.ts` — integration API tests hitting the actual `https://reqres.in` API.
- `tests/api-mock-test.spec.ts` — front-end tests that mock API responses using `page.route`.
- Helpers and fixtures:
  - `tests/helpers/apiCalls.ts` — HTTP client wrappers for API actions.
  - `tests/helpers/dataGenerator.ts` — test data generation using `faker`.
  - `tests/fixtures/api-fixture.ts` — adds `api` fixture for API interactions.
  - `tests/fixtures/api-mock-fixture.ts` — adds `mockUserApi` fixture for mocking endpoints.
- `tests/testData/expectedUser.json` — sample expected user used by `api-test.spec.ts`.

---

## Quick Run Commands ⚡

Install dependencies (Windows PowerShell):
```powershell
npm install
```

Type-check the project (no tests):
```powershell
npm run test
```

Run all Playwright tests:
```powershell
npm run test:run
```

Run tests with the Playwright test UI (Visual interactive runner):
```powershell
npm run test:ui
```

Run a specific test file:
```powershell
npx playwright test tests/api-test.spec.ts
npx playwright test tests/api-mock-test.spec.ts
```

Run a single test by name pattern:
```powershell
npx playwright test -g "Add new user via API"
```

---

## Observations & Important Notes ⚠️

- There is a `test.only` in `tests/api-mock-test.spec.ts`. Remove `test.only` to run all tests at once.
- `package.json` contains a `test` command that runs `tsc --noEmit`. To actually run Playwright tests, use `npm run test:run` or `npx playwright test`.
- `tests/helpers/dataGenerator.ts` has a bug: `faker.person.firstName` is used without invoking it in `generateNewUser`. This should be `faker.person.firstName()`.
- Some tests have commented-out assertions. Un-comment and update them when implementing new behavior if needed.
- `playwright.config.ts` already points to `baseURL` `https://reqres.in` and includes `x-api-key` header by default—this is fine for the course's purposes.

---

## Homework Tasks — `api-test` (API integration tests) ✅

Goal: Add the requested tests and helper methods to support full Create/Update/Delete flows and authentication flows.

1) Implement full CRUD helper methods in `APICalls` (in `tests/helpers/apiCalls.ts`):
   - `patchUser(request, id, userData)`: PATCH `/api/users/:id`.
   - `deleteUser(request, id)`: DELETE `/api/users/:id`.
   - `registerUser(request, credentials)`: POST `/api/register`.
   - `loginUser(request, credentials)`: POST `/api/login`.

   Example snippet:
```ts
static async patchUser(request: APIRequestContext, id: string|number, userData: object) {
  const res = await request.patch(`/api/users/${id}`, { data: userData, headers: { 'Content-Type': 'application/json' } });
  if (!res.ok()) throw new Error(`API request failed with status ${res.status()}`);
  return await res.json();
}

static async deleteUser(request: APIRequestContext, id: string|number) {
  const res = await request.delete(`/api/users/${id}`);
  if (!res.ok() && res.status() !== 204) throw new Error(`API request failed with status ${res.status()}`);
  return res.status(); // useful for assertions (204)
}

static async registerUser(request: APIRequestContext, credentials: {email: string, password: string}) {
  const res = await request.post('/api/register', { data: credentials, headers: { 'Content-Type': 'application/json' } });
  if (!res.ok()) throw new Error(`API request failed with status ${res.status()}`);
  return await res.json();
}

static async loginUser(request: APIRequestContext, credentials: {email: string, password: string}) {
  const res = await request.post('/api/login', { data: credentials, headers: { 'Content-Type': 'application/json' } });
  if (!res.ok()) throw new Error(`API request failed with status ${res.status()}`);
  return await res.json();
}
```

2) Extend `ApiClient` type in `tests/fixtures/api-fixture.ts` and the `api` fixture to include the newly added methods: `patchUser`, `deleteUser`, `registerUser`, `loginUser`.

3) Create JSON test data in `tests/testData`:
   - `newUser.json` — contains a sample create user payload (e.g., name, job)
   - `credentials.json` — contains credentials for register/login, for example: {"email": "eve.holt@reqres.in", "password": "pistol"}

4) Add tests to `tests/api-test.spec.ts`:
   - Write a test where you create a user using POST (use `newUser.json`), assert required fields in the response and store `id`.
   - Patch the created user with new values using PATCH; assert updated fields in returned data.
   - Delete the user in an `afterAll` hook using `deleteUser` and assert that the API returns a 204 status.

   Example test flow skeleton:
```ts
import { test, expect } from './fixtures/api-fixture';
import newUserData from './testData/newUser.json';
import credentials from './testData/credentials.json';

let createdUserId: string;

test.describe('API tests', () => {
  test.beforeAll(async ({ api }) => {
    // ensure endpoint is reachable if needed
  });

  test('Create -> Update -> Delete user', async ({ api }) => {
     const createRes = await api.postUser(newUserData);
     expect(createRes).toHaveProperty('id');
     createdUserId = createRes.id;

     const updatedUser = await api.patchUser(createdUserId, { name: 'Updated Name' });
     expect(updatedUser).toHaveProperty('name', 'Updated Name');
    
  });

  test.afterAll(async ({ api }) => {
    if (createdUserId) {
      const status = await api.deleteUser(createdUserId);
      expect(status).toBe(204);
    }
  });
});
```

5) Add test(s) for register & login (credentials in `credentials.json`):
   - Implement a test that calls `api.registerUser(credentials)` and assert token or id.
   - Implement a test that calls `api.loginUser(credentials)` and assert token.

   Example snippet:
```ts
const registerRes = await api.registerUser(credentials);
expect(registerRes).toHaveProperty('token');

const loginRes = await api.loginUser(credentials);
expect(loginRes).toHaveProperty('token');
```

6) Optional but helpful:
   - Fix data generator: call functions rather than referencing them. e.g. `faker.person.firstName()`.
   - Add stronger types for request/response payloads and return them from helpers.
   - Add logging for requests/responses when debugging tests.

---

## Homework Tasks — `api-mock` (Mocked endpoint tests) ✅

Goal: Extend the mock fixture and add new tests for PATCH and DELETE flows.

1) Update `tests/fixtures/api-mock-fixture.ts` to support `PATCH` and `DELETE` methods in `page.route('/api/users')`.
   - For `PATCH`, read the request JSON, apply the changes (for example update email) to a `mockedUser` and return `200` with updated body.
   - For `DELETE`, return a `204` status with empty body.

2) Add tests in `tests/api-mock-test.spec.ts`:
   - Mock PATCH: navigate to root, `fetch('/api/users', { method: 'PATCH', body: ... })`, assert the returned user has the modified email.
   - Mock DELETE: perform a DELETE call and assert the response status is `204` and/or the user is removed from subsequent GET calls. Use `afterAll` to assert cleanup if needed.

3) Example `page.route` handling for PATCH/DELETE:
```ts
if (route.request().method() === 'PATCH') {
   const requestBody = route.request().postDataJSON();
   const baseUser = DataGenerator.generateUser();
   const updatedUser = { ...baseUser, ...requestBody };
   await route.fulfill({ status: 200, body: JSON.stringify(updatedUser) });
}
if (route.request().method() === 'DELETE') {
   await route.fulfill({ status: 204, body: '' });
}
```

4) Create or update mocked data in the fixtures where needed and add more assertions to check types and values.

---

## Examples & Quick Implementation Tips 💡

- Remove `test.only` in `api-mock-test.spec.ts` before running tests locally.
- Ensure `faker` functions are invoked to return generated values.
- For the delete test: remember that `reqres.in` returns `204` for delete operations. Use `res.status()` to assert.
- For register/login, ReqRes example credentials:
  - register: {"email": "eve.holt@reqres.in", "password": "pistol"}
  - login: {"email": "eve.holt@reqres.in", "password": "cityslicka"}

---

## Recommended tests to add (summary)

- Integration API (`tests/api-test.spec.ts`):
  - Create user (POST) with JSON data
  - Update user (PATCH) with new field(s)
  - Delete user (DELETE) in `afterAll`
  - Register and Login tests

- Mocked API (`tests/api-mock-test.spec.ts`):
  - Mock GET user (already present)
  - Mock POST user (already present)
  - Mock PATCH user (homework)
  - Mock DELETE user (homework + `afterAll` cleanup)

---

## Quick Troubleshooting ⚠️

- If `playwright test` returns no tests, check for `test.only` usage and remove it.
- If your marked fixture is missing or a helper fails, run `npm run test` to check types and fix compile errors.
- If using the real API (`baseURL: https://reqres.in`), be careful about the actual behavior (some endpoints are demo-only and may return 204 or 200 depending on implementation)

---

Happy testing! If you'd like, I can create starter skeletons for the new tests and helper methods as a follow-up. 👍
