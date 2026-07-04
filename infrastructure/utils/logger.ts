import pino from 'pino';

let instance = pino({ level: 'info' });

export const logger = {
  configure(config: { level: string; format: 'plain' | 'json' }) {
    const level = config.level === 'NONE' ? 'silent' : config.level.toLowerCase();

    instance =
      config.format === 'plain'
        ? pino({
            level,
            transport: {
              target: 'pino-pretty',
              options: { colorize: true, translateTime: 'SYS:standard' },
            },
          })
        : pino({ level });
  },

  child(context: Record<string, unknown>): pino.Logger {
    return instance.child(context);
  },

  debug(msg: string, ...args: unknown[]): void {
    // @ts-expect-error pino overloads accept any[], not unknown[]
    instance.debug(msg, ...args);
  },

  info(msg: string, ...args: unknown[]): void {
    // @ts-expect-error pino overloads accept any[], not unknown[]
    instance.info(msg, ...args);
  },

  warn(msg: string, ...args: unknown[]): void {
    // @ts-expect-error pino overloads accept any[], not unknown[]
    instance.warn(msg, ...args);
  },

  error(msg: string, ...args: unknown[]): void {
    // @ts-expect-error pino overloads accept any[], not unknown[]
    instance.error(msg, ...args);
  },
};
