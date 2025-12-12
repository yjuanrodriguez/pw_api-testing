import { test as base } from '@playwright/test';
import { DataGenerator } from '../helpers/dataGenerator';

type Fixtures = {
  mockUserApi: void;
};

export const test = base.extend<Fixtures>({
  mockUserApi: async ({ page }, use) => {   
    await page.route("/api/users", async (route) => {
      if (route.request().method() === 'GET') {

        const mockedGetJson = DataGenerator.generateUser();
        console.log("generated user: ", mockedGetJson);
        await route.fulfill({
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockedGetJson),
        });
      } else if (route.request().method() === 'POST') {
        const requestBody = route.request().postDataJSON();
        console.log("request body: ", requestBody);
        const mockedPostJson = {
          id: DataGenerator.generateUser().id,
          ...requestBody,
        };
        console.log("mocked post json: ", mockedPostJson);
        await route.fulfill({
          status: 201,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockedPostJson),
        });
      } else if (route.request().method() === 'PATCH') {
        const requestBody = route.request().postDataJSON();
        const baseUser = DataGenerator.generateUser();
        const updatedUser = { ...baseUser, ...requestBody };
        console.log("mocked patch json: ", updatedUser);
        await route.fulfill({
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser),
        });
      } else if (route.request().method() === 'DELETE') {
        console.log('mocked delete on /api/users');
        await route.fulfill({
          status: 204,
          headers: {
            'Content-Type': 'application/json',
          },
          body: '',
        });
      }
    });

    await use();
  },
});

export const expect = test.expect;