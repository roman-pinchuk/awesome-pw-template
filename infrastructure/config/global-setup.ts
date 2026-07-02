import { loadEnv } from '@/infrastructure/config/env';

export default function globalSetup(): void {
  loadEnv();
}
