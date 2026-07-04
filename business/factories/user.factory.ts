import type { Env } from '@infrastructure/config/env';

export type TestUser = {
  username: string;
  password: string;
};

export type TestUsers = Record<'standard' | 'lockedOut', TestUser>;

export const createUsers = (
  env: Pick<Env, 'SAUCE_USERNAME' | 'SAUCE_PASSWORD'>,
): TestUsers => {
  const { SAUCE_USERNAME: standard, SAUCE_PASSWORD: password } = env;
  return {
    standard: { username: standard, password },
    lockedOut: { username: 'locked_out_user', password },
  };
};
