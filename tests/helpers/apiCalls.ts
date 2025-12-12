import { APIRequestContext } from "@playwright/test";
import { DataGenerator } from "./dataGenerator";

type CreateUserRequest = {
  name?: string;
  job?: string;
};

export class APICalls {
  static async getListUsers(request: APIRequestContext, page: number = 2) {
    const res = await request.get('/api/users', {
      params: {
        page: page
      },
      headers: { "Content-Type": "application/json" }
    });
    
    if (!res.ok()) {
      throw new Error(`API request failed with status ${res.status()}: ${res.statusText()}`);
    }
    
    return await res.json();
  }

  static async postUser(request: APIRequestContext, userData?: CreateUserRequest) {
    const newUser = userData || DataGenerator.generateNewUser();
    const res = await request.post('/api/users', {
      data: newUser,
      headers: { "Content-Type": "application/json" }
    });
    
    if (!res.ok()) {
      throw new Error(`API request failed with status ${res.status()}: ${res.statusText()}`);
    }
    
    return await res.json();
  }

  static async patchUser(request: APIRequestContext, id: string | number, userData: CreateUserRequest | object) {
    const res = await request.patch(`/api/users/${id}`, {
      data: userData,
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok()) {
      throw new Error(`API request failed with status ${res.status()}: ${res.statusText()}`);
    }

    return await res.json();
  }

  static async deleteUser(request: APIRequestContext, id: string | number) {
    const res = await request.delete(`/api/users/${id}`);

    if (!res.ok() && res.status() !== 204) {
      throw new Error(`API request failed with status ${res.status()}: ${res.statusText()}`);
    }

    return res.status();
  }

  static async registerUser(request: APIRequestContext, credentials: { email: string; password: string }) {
    const res = await request.post('/api/register', {
      data: credentials,
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok()) {
      throw new Error(`API request failed with status ${res.status()}: ${res.statusText()}`);
    }

    return await res.json();
  }

  static async loginUser(request: APIRequestContext, credentials: { email: string; password: string }) {
    const res = await request.post('/api/login', {
      data: credentials,
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok()) {
      throw new Error(`API request failed with status ${res.status()}: ${res.statusText()}`);
    }

    return await res.json();
  }
}