
# Homework: API Tests (Summary)

This repository contains a small Playwright Test suite focused on the example API (ReqRes). The sections below include only the **Homework** tasks and a brief explanation of the two test case files used in this project.

---

## ✅ Homework

- Implement the full **Create → Patch → Delete** flow using existing helpers and fixtures:
  - Use `postUser`, store the returned `id`.
  - Call `patchUser` for the `id` and assert updated fields are present.
  - Delete the resource with `deleteUser` in `afterAll` and assert the response is `204`.
- Add **Register** and **Login** tests using `registerUser` and `loginUser` and assert they return a `token`.
- Improve `DataGenerator.generateNewUser()` to accept **overrides** and an optional **seed** for deterministic test data.
- Keep helpers (`APICalls`) and fixtures (`api-fixture`) clean and DRY: use shared types and consider a small `bind` helper to attach `request`.

---

## 🧪 Test case summary (brief)

- `tests/api-test.spec.ts` — Integration tests against the real API (baseURL: `https://reqres.in`):
  - Verify `GET /api/users` returns the expected list and fields.
  - Create a user with `POST /api/users` (assert `id` and `createdAt`), update with `PATCH`, and delete with `DELETE` (expect `204`).
  - Register and login tests assert a `token` is returned.

- `tests/api-mock-test.spec.ts` — Tests using mocked API responses (`page.route`):
  - Intercept and respond to `GET/POST/PATCH/DELETE` calls to simulate the API without hitting the real service.
  - Useful for deterministic, fast tests and for validating UI or local logic.



## Quick Troubleshooting ⚠️

- If `playwright test` returns no tests, check for `test.only` usage and remove it.
- If your marked fixture is missing or a helper fails, run `npm run test` to check types and fix compile errors.
- If using the real API (`baseURL: https://reqres.in`), be careful about the actual behavior (some endpoints are demo-only and may return 204 or 200 depending on implementation)

---

