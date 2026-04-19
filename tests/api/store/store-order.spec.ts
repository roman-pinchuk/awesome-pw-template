import { test, expect } from '@/fixtures/api.fixture';
import { buildOrder, buildPet } from '@/data/pet.factory';

test.describe('Store order API', () => {
  test('places and removes an order', async ({ petstore }) => {
    const pet = buildPet();
    await petstore.createPet(pet);

    const order = buildOrder({ petId: pet.id });
    const createOrderResponse = await petstore.createOrder(order);
    await petstore.expectOrder(createOrderResponse, {
      id: order.id,
      petId: pet.id,
      status: 'placed',
    });

    const getOrderResponse = await petstore.getOrder(Number(order.id));
    await petstore.expectOrder(getOrderResponse, { id: order.id, petId: pet.id });

    const deleteOrderResponse = await petstore.deleteOrder(Number(order.id));
    expect(deleteOrderResponse.ok()).toBeTruthy();

    await petstore.deletePet(Number(pet.id));
  });
});
