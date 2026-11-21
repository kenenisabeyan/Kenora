import pino, { LoggerOptions } from "pino";

export * from "./resilience.js";

export interface LoggerConfig {
  serviceName: string;
  level?: string;
}

export function createLogger(config: LoggerConfig) {
  const isDev = process.env.NODE_ENV !== "production";
  const options: LoggerOptions = {
    name: config.serviceName,
    level: config.level || process.env.LOG_LEVEL || "info",
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: (label) => ({ level: label }),
    },
    transport: isDev
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        }
      : undefined,
  };

  return pino(options);
}

import { AsyncLocalStorage } from "node:async_hooks";

const correlationStorage = new AsyncLocalStorage<string>();

export class CorrelationContext {
  static run<T>(requestId: string, callback: () => T): T {
    return correlationStorage.run(requestId, callback);
  }

  static getRequestId(): string | undefined {
    return correlationStorage.getStore();
  }
}
