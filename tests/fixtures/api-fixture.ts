import { test as base } from '@playwright/test';
import { APICalls } from '../helpers/apiCalls';

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

type UsersListResponse = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
};

type CreateUserRequest = {
  name?: string;
  job?: string;
};

type CreateUserResponse = {
  id: string;
  name?: string;
  job?: string;
  createdAt: string;
};

export type ApiClient = {
  getListUsers: (page?: number) => Promise<UsersListResponse>;
  postUser: (userData?: CreateUserRequest) => Promise<CreateUserResponse>;
  patchUser: (id: string | number, userData: CreateUserRequest | object) => Promise<any>;
  deleteUser: (id: string | number) => Promise<number>;
  registerUser: (credentials: { email: string; password: string }) => Promise<any>;
  loginUser: (credentials: { email: string; password: string }) => Promise<any>;
};

type Fixtures = {
  api: ApiClient;
};

export type FixturesType = Fixtures;

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    const apiClient: ApiClient = {
      getListUsers: async (page?: number) => {
        try {
          return await APICalls.getListUsers(request, page);
        } catch (error) {
          throw new Error(`Failed to get list of users: ${error instanceof Error ? error.message : String(error)}`);
        }
      },
      postUser: async (userData?: CreateUserRequest) => {
        try {
          return await APICalls.postUser(request, userData);
        } catch (error) {
          throw new Error(`Failed to create user: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      ,
      patchUser: async (id: string | number, userData: CreateUserRequest | object) => {
        try {
          return await APICalls.patchUser(request, id, userData);
        } catch (error) {
          throw new Error(`Failed to patch user: ${error instanceof Error ? error.message : String(error)}`);
        }
      },
      deleteUser: async (id: string | number) => {
        try {
          return await APICalls.deleteUser(request, id);
        } catch (error) {
          throw new Error(`Failed to delete user: ${error instanceof Error ? error.message : String(error)}`);
        }
      },
      registerUser: async (credentials: { email: string; password: string }) => {
        try {
          return await APICalls.registerUser(request, credentials);
        } catch (error) {
          throw new Error(`Failed to register user: ${error instanceof Error ? error.message : String(error)}`);
        }
      },
      loginUser: async (credentials: { email: string; password: string }) => {
        try {
          return await APICalls.loginUser(request, credentials);
        } catch (error) {
          throw new Error(`Failed to login user: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    };

    await use(apiClient);
  },
});

export const expect = test.expect;
