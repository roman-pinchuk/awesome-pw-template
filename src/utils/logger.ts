import { loadEnv } from '@/config/env';

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'NONE';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

class Logger {
  private readonly currentLevel: number;

  constructor() {
    const env = loadEnv();
    this.currentLevel = LOG_LEVEL_PRIORITY[env.LOG_LEVEL as LogLevel] ?? LOG_LEVEL_PRIORITY.INFO;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.currentLevel <= LOG_LEVEL_PRIORITY.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.currentLevel <= LOG_LEVEL_PRIORITY.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.currentLevel <= LOG_LEVEL_PRIORITY.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, ...args: unknown[]): void {
    if (this.currentLevel <= LOG_LEVEL_PRIORITY.ERROR) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }
}

export const logger = new Logger();
