const BASE = process.env.BASE_URL ?? 'https://www.saucedemo.com';

export const URLS = {
  INVENTORY: `${BASE}/inventory.html`,
  CART: `${BASE}/cart.html`,
  CHECKOUT_STEP_ONE: `${BASE}/checkout-step-one.html`,
  CHECKOUT_STEP_TWO: `${BASE}/checkout-step-two.html`,
  CHECKOUT_COMPLETE: `${BASE}/checkout-complete.html`,
} as const;

export const PRODUCTS = {
  BACKPACK: 'Sauce Labs Backpack',
  BIKE_LIGHT: 'Sauce Labs Bike Light',
  BOLT_SHIRT: 'Sauce Labs Bolt T-Shirt',
  FLEECE_JACKET: 'Sauce Labs Fleece Jacket',
  ONESIE: 'Sauce Labs Onesie',
  TEST_ALL_THINGS: 'Test.allTheThings() T-Shirt',
} as const;
