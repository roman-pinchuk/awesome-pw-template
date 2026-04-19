import { test, expect } from '@/fixtures/api.fixture';

test.describe('Pet query API', () => {
  test('returns pets for a supported status filter', async ({ petstore }) => {
    const response = await petstore.findPetsByStatus('available');
    const pets = (await response.json()) as Array<{ status?: string }>;

    expect(response.ok()).toBeTruthy();
    expect(pets.length).toBeGreaterThan(0);
    expect(pets.every((pet) => pet.status === 'available')).toBeTruthy();
  });

  test('rejects an unsupported pet id format', async ({ petstore }) => {
    const response = await petstore.getPetById('not-a-number');

    expect(response.status()).toBe(400);
  });
});
