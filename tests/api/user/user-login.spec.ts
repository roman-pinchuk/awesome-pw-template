import { test, expect } from '@/fixtures/api.fixture';
import { loadEnv } from '@/config/env';

const env = loadEnv();

test.describe('User API', () => {
  test('reads an existing user and exercises login/logout endpoints', async ({ petstore }) => {
    const getUserResponse = await petstore.getUserByName(env.PW_API_USERNAME);
    expect(getUserResponse.ok()).toBeTruthy();
    await expect(getUserResponse.json()).resolves.toMatchObject({
      username: env.PW_API_USERNAME,
      email: 'email1@test.com',
    });

    const loginResponse = await petstore.loginUser(env.PW_API_USERNAME, env.PW_API_PASSWORD);
    await petstore.expectText(loginResponse, /logged in user session/i);

    const logoutResponse = await petstore.logoutUser();
    await petstore.expectText(logoutResponse, /logged out/i);
  });
});
