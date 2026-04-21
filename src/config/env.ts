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
  UI_BASE_URL: z.url().default('https://practicesoftwaretesting.com'),
  API_BASE_URL: z
    .url()
    .default('https://api.restful-api.dev/')
    .transform((value) => (value.endsWith('/') ? value : `${value}/`)),
  API_KEY: z.string().min(1),
  USER_EMAIL: z.string().email().default('customer@practicesoftwaretesting.com'),
  USER_PASSWORD: z.string().min(1).default('welcome01'),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  return envSchema.parse(process.env);
}
