import { test, expect } from '@/fixtures/api.fixture';
import { buildPet } from '@/data/pet.factory';

test.describe('Pet API', () => {
  test('creates, reads, updates, and deletes a pet', async ({ petstore }) => {
    const pet = buildPet();
    const createResponse = await petstore.createPet(pet);
    const createdPet = await petstore.expectPet(createResponse, {
      id: pet.id,
      name: pet.name,
      status: 'available',
    });

    const getResponse = await petstore.getPetById(Number(createdPet.id));
    await petstore.expectPet(getResponse, { id: pet.id, name: pet.name });

    const updatedPet = buildPet({
      id: pet.id,
      name: `${createdPet.name}-updated`,
      photoUrls: pet.photoUrls,
      status: 'sold',
    });

    const updateResponse = await petstore.updatePet(updatedPet);
    await petstore.expectPet(updateResponse, {
      id: updatedPet.id,
      name: updatedPet.name,
      status: 'sold',
    });

    const deleteResponse = await petstore.deletePet(Number(updatedPet.id));
    expect(deleteResponse.ok()).toBeTruthy();

    const afterDelete = await petstore.getPetById(Number(updatedPet.id));
    expect(afterDelete.status()).toBe(404);
  });
});
