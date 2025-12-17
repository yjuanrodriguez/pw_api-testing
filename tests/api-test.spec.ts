import { test, expect } from './fixtures/api-fixture';
import type { ApiClient } from './fixtures/api-fixture';
import expectedUser from './testData/expectedUser.json';
import newUserData from './testData/newUser.json';
import credentials from './testData/credentials.json';

// Homework implemented: Create->Patch->Delete tests, Register & Login tests added, API helper methods and fixture updated.


test.describe('API tests', () => {
  let createdUserId: string | undefined;
  test('Get list users via API', async ({ api }: { api: ApiClient }) => {
    const users = await api.getListUsers();
    console.log(users);
    expect(users.data[0].email, "Email address is not correct, should be " + expectedUser.email).toBe(expectedUser.email);
    expect(users.total, "Total number of users is not correct, should be 12").toBe(12);
    expect(users.data[0]).toHaveProperty('id');
    expect(users.data[0].first_name, "First name is not correct, should be " + expectedUser.first_name).toBe(expectedUser.first_name);
    expect(users.data[0].last_name, "Last name is not correct, should be " + expectedUser.last_name).toBe(expectedUser.last_name);
    expect(users.data[0].avatar, "Avatar is not correct, should be " + expectedUser.avatar).toBe(expectedUser.avatar);

  });
  test("Add new user via API", async ({ api }: { api: ApiClient }) => {
    const newUser = await api.postUser();
   
   
    const users = await api.getListUsers();
    console.log(users);
    
     
    expect(newUser, "Job is not present").toHaveProperty('job');
    expect(newUser, "Id is not present").toHaveProperty('id');
    expect(typeof newUser.id, "Id must be a string").toBe('string');
    expect(newUser, "Created at is not present").toHaveProperty('createdAt');
    expect(typeof newUser.createdAt, "Created at must be a string").toBe('string');
  });

  test('Create, update and verify then delete user via API', async ({ api }: { api: ApiClient }) => {
    
    // Create user
    const created = await api.postUser(newUserData);
    expect(created, 'Created user should have id').toHaveProperty('id');
    createdUserId = created.id;
    expect(typeof created.id, 'Created id should be a string').toBe('string');

    // PATCH
    const updated = await api.patchUser(createdUserId, { name: 'Updated Name', job: 'Updated Job' });
    expect(updated, 'Updated response should have name').toHaveProperty('name');
    expect(updated, 'Updated response should have job').toHaveProperty('job');
    expect(updated.name, 'Name should be updated').toBe('Updated Name');
  });

  test('Register and login using API', async ({ api }: { api: ApiClient }) => {
    const registerResp = await api.registerUser(credentials as { email: string; password: string });
    
    // The register endpoint returns id and token for reqres
    expect(registerResp).toHaveProperty('token');

    const loginResp = await api.loginUser(credentials as { email: string; password: string });
    expect(loginResp).toHaveProperty('token');
  });

  test.afterAll(async ({ api }: { api: ApiClient }) => {
    if (createdUserId) {
      const status = await api.deleteUser(createdUserId);
      
      // reqres returns 204 for delete
      expect(status).toBe(204);
    }
  });
  
});
