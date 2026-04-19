import { loadEnv } from './env';

export default function globalSetup(): void {
  loadEnv();
}
