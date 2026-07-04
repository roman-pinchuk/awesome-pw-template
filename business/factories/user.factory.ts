import type { Env } from '@infrastructure/config/env';

/** SauceDemo credentials used by authentication tests. */
export type TestUser = {
  username: string;
  password: string;
};

/** Named user profiles available to UI fixtures. */
export type TestUsers = Record<'standard' | 'lockedOut', TestUser>;

/**
 * Builds SauceDemo user profiles from validated runtime configuration.
 *
 * @remarks
 * The standard user is configurable for environments, while the locked-out user
 * remains the SauceDemo canonical account used for negative login coverage.
 */
export const createUsers = (
  env: Pick<Env, 'SAUCE_USERNAME' | 'SAUCE_PASSWORD'>,
): TestUsers => {
  const { SAUCE_USERNAME: standard, SAUCE_PASSWORD: password } = env;
  return {
    standard: { username: standard, password },
    lockedOut: { username: 'locked_out_user', password },
  };
};
