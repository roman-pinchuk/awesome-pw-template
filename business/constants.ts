export const USERS = {
  STANDARD: 'standard_user',
  LOCKED_OUT: 'locked_out_user',
  PROBLEM: 'problem_user',
  PERFORMANCE_GLITCH: 'performance_glitch_user',
  ERROR: 'error_user',
  VISUAL: 'visual_user',
} as const;

export const PASSWORD = 'secret_sauce';

export const URLS = {
  BASE: 'https://www.saucedemo.com',
  INVENTORY: 'https://www.saucedemo.com/inventory.html',
  CART: 'https://www.saucedemo.com/cart.html',
  CHECKOUT_STEP_ONE: 'https://www.saucedemo.com/checkout-step-one.html',
  CHECKOUT_STEP_TWO: 'https://www.saucedemo.com/checkout-step-two.html',
  CHECKOUT_COMPLETE: 'https://www.saucedemo.com/checkout-complete.html',
} as const;

export const PRODUCTS = {
  BACKPACK: 'Sauce Labs Backpack',
  BIKE_LIGHT: 'Sauce Labs Bike Light',
  BOLT_SHIRT: 'Sauce Labs Bolt T-Shirt',
  FLEECE_JACKET: 'Sauce Labs Fleece Jacket',
  ONESIE: 'Sauce Labs Onesie',
  TEST_ALL_THINGS: 'Test.allTheThings() T-Shirt',
} as const;
