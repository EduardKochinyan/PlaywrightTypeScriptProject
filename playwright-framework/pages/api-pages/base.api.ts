import { APIRequestContext, APIResponse } from '@playwright/test';

export abstract class BaseAPI {
  protected request: APIRequestContext;
  protected baseURL: string;

  constructor(request: APIRequestContext, baseURL: string) {
    this.request = request;
    this.baseURL = baseURL;
  }

  protected async get(endpoint: string, headers?: Record<string, string>): Promise<APIResponse> {
    return this.request.get(`${this.baseURL}${endpoint}`, { headers });
  }

  protected async post(
    endpoint: string,
    data: unknown,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    return this.request.post(`${this.baseURL}${endpoint}`, {
      data,
      headers: { 'Content-Type': 'application/json', ...headers },
    });
  }

  protected async put(
    endpoint: string,
    data: unknown,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    return this.request.put(`${this.baseURL}${endpoint}`, {
      data,
      headers: { 'Content-Type': 'application/json', ...headers },
    });
  }

  protected async patch(
    endpoint: string,
    data: unknown,
    headers?: Record<string, string>
  ): Promise<APIResponse> {
    return this.request.patch(`${this.baseURL}${endpoint}`, {
      data,
      headers: { 'Content-Type': 'application/json', ...headers },
    });
  }

  protected async delete(endpoint: string, headers?: Record<string, string>): Promise<APIResponse> {
    return this.request.delete(`${this.baseURL}${endpoint}`, { headers });
  }

  protected async parseJSON<T>(response: APIResponse): Promise<T> {
    return response.json() as Promise<T>;
  }
}
