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
  PW_UI_BASE_URL: z.url().default('https://practicesoftwaretesting.com'),
  PW_API_BASE_URL: z
    .url()
    .default('https://petstore3.swagger.io/api/v3/')
    .transform((value) => (value.endsWith('/') ? value : `${value}/`)),
  PW_API_USERNAME: z.string().min(1),
  PW_API_PASSWORD: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  return envSchema.parse(process.env);
}
