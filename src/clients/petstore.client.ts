import { expect, type APIRequestContext, type APIResponse } from '@playwright/test';
import type { components } from '../contracts/petstore.generated';
import { expectOk } from '../utils/api-assertions';

type Pet = components['schemas']['Pet'];
type Order = components['schemas']['Order'];
type User = components['schemas']['User'];

export class PetstoreClient {
  constructor(private readonly request: APIRequestContext) {}

  async createPet(pet: Pet): Promise<APIResponse> {
    return this.request.post('pet', { data: pet });
  }

  async getPetById(petId: number | string): Promise<APIResponse> {
    return this.request.get(`pet/${petId}`);
  }

  async updatePet(pet: Pet): Promise<APIResponse> {
    return this.request.put('pet', { data: pet });
  }

  async findPetsByStatus(status: 'available' | 'pending' | 'sold'): Promise<APIResponse> {
    return this.request.get('pet/findByStatus', {
      params: { status },
    });
  }

  async deletePet(petId: number | string): Promise<APIResponse> {
    return this.request.delete(`pet/${petId}`);
  }

  async createOrder(order: Order): Promise<APIResponse> {
    return this.request.post('store/order', { data: order });
  }

  async getOrder(orderId: number | string): Promise<APIResponse> {
    return this.request.get(`store/order/${orderId}`);
  }

  async deleteOrder(orderId: number | string): Promise<APIResponse> {
    return this.request.delete(`store/order/${orderId}`);
  }

  async createUser(user: User): Promise<APIResponse> {
    return this.request.post('user', { data: user });
  }

  async loginUser(username: string, password: string): Promise<APIResponse> {
    return this.request.get('user/login', {
      params: { username, password },
    });
  }

  async logoutUser(): Promise<APIResponse> {
    return this.request.get('user/logout');
  }

  async getUserByName(username: string): Promise<APIResponse> {
    return this.request.get(`user/${username}`);
  }

  async expectPet(response: APIResponse, expected: Partial<Pet>): Promise<Pet> {
    await expectOk(response);
    const body = (await response.json()) as Pet;
    expect(body).toMatchObject(expected);
    return body;
  }

  async expectOrder(response: APIResponse, expected: Partial<Order>): Promise<Order> {
    await expectOk(response);
    const body = (await response.json()) as Order;
    expect(body).toMatchObject(expected);
    return body;
  }

  async expectText(response: APIResponse, expectedText: RegExp | string): Promise<void> {
    await expectOk(response);
    await expect(response.text()).resolves.toMatch(expectedText);
  }
}
