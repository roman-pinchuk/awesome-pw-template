import { config as loadDotenv } from '@dotenvx/dotenvx';
import { z } from 'zod';

if (process.env.CI !== 'true') {
  loadDotenv({
    path: '.env.local',
    quiet: true,
  });
}

const envSchema = z.object({
  CI: z
    .string()
    .optional()
    .transform((value) => value === 'true'),
  API_BASE_URL: z
    .string()
    .url()
    .transform((value) => (value.endsWith('/') ? value : `${value}/`)),
  LOG_LEVEL: z.enum(['DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE']).default('INFO'),
  LOG_FORMAT: z.enum(['plain', 'json']).default(process.env.CI === 'true' ? 'json' : 'plain'),
  BASE_URL: z.url().default('https://www.saucedemo.com'),
  SAUCE_USERNAME: z.string().default('standard_user'),
  SAUCE_PASSWORD: z.string().default('secret_sauce'),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const missing = result.error.issues
      .map((i) => `  - ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Environment validation failed:\n${missing}`);
  }
  return result.data;
}
