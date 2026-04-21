import { loadEnv } from '@/config/env';

export default function globalSetup(): void {
  loadEnv();
}
