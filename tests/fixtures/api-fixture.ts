import { test as base, APIRequestContext } from '@playwright/test';
import { APICalls } from '../helpers/apiCalls';

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
};

export type UsersListResponse = {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  data: User[];
};

export type CreateUserRequest = {
  name?: string;
  job?: string;
};

export type CreateUserResponse = {
  id: string;
  name?: string;
  job?: string;
  createdAt: string;
};

export type PatchUserResponse = { name?: string; job?: string; updatedAt?: string };
export type AuthResponse = { token?: string; id?: string; error?: string };

export type ApiClient = {
  getListUsers: (page?: number) => Promise<UsersListResponse>;
  postUser: (userData?: CreateUserRequest) => Promise<CreateUserResponse>;
  patchUser: (id: string | number, userData: CreateUserRequest | object) => Promise<PatchUserResponse>;
  deleteUser: (id: string | number) => Promise<number>;
  registerUser: (credentials: { email: string; password: string }) => Promise<AuthResponse>;
  loginUser: (credentials: { email: string; password: string }) => Promise<AuthResponse>;
};

type Fixtures = {
  api: ApiClient;
};

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    // bind request context to APICalls methods to avoid repetitive wrappers
    const bind = (fn: (...args: any[]) => Promise<any>) => (...args: any[]) => fn(request as APIRequestContext, ...args);

    const apiClient: ApiClient = {
      getListUsers: bind(APICalls.getListUsers),
      postUser: bind(APICalls.postUser),
      patchUser: bind(APICalls.patchUser),
      deleteUser: bind(APICalls.deleteUser),
      registerUser: bind(APICalls.registerUser),
      loginUser: bind(APICalls.loginUser),
    };

    await use(apiClient);
  },
});

export const expect = test.expect;
