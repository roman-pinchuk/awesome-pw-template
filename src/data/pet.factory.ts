import type { components } from '../contracts/petstore.generated';
import { randomId, randomInt } from '../utils/random';

type Pet = components['schemas']['Pet'];
type Order = components['schemas']['Order'];

export type PetPayload = Pet & { id: number };
export type OrderPayload = Order & { id: number; petId: number };

export function buildPet(overrides: Partial<PetPayload> = {}): PetPayload {
  const id = randomInt(500_000, 999_999);

  return {
    id,
    name: randomId('pw-pet'),
    photoUrls: [`https://example.test/pets/${id}.png`],
    category: {
      id: 1,
      name: 'Playwright Pets',
    },
    tags: [
      {
        id: 1,
        name: 'e2e',
      },
    ],
    status: 'available',
    ...overrides,
  };
}

export function buildOrder(overrides: Partial<OrderPayload> = {}): OrderPayload {
  return {
    id: randomInt(50_000, 90_000),
    petId: randomInt(500_000, 999_999),
    quantity: 1,
    shipDate: new Date().toISOString(),
    status: 'placed',
    complete: false,
    ...overrides,
  };
}
