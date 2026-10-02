import pino, { LoggerOptions } from "pino";

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

export class CorrelationContext {
  private static currentRequestId: string | null = null;

  static setRequestId(id: string) {
    this.currentRequestId = id;
  }

  static getRequestId(): string | null {
    return this.currentRequestId;
  }

  static clear() {
    this.currentRequestId = null;
  }
}
