import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

export const DEFAULT_JWT_SECRET =
  "super-secret-kenora-jwt-token-key-change-in-production";
export const DEFAULT_DB_URL =
  "postgresql://kenora:kenorapass@localhost:5432/kenoradb?sslmode=disable";

export const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().default(4000),
    WEB_PORT: z.coerce.number().default(3000),
    WORKER_PORT: z.coerce.number().default(4001),
    LOG_LEVEL: z
      .enum(["fatal", "error", "warn", "info", "debug", "trace"])
      .default("info"),
    DATABASE_URL: z.string().default(DEFAULT_DB_URL),
    REDIS_URL: z.string().default("redis://localhost:6379"),
    NATS_URL: z.string().default("nats://localhost:4222"),
    S3_ENDPOINT: z.string().default("http://localhost:9000"),
    S3_ACCESS_KEY_ID: z.string().default("minioadmin"),
    S3_SECRET_ACCESS_KEY: z.string().default("minioadmin"),
    S3_BUCKET_NAME: z.string().default("kenora-artifacts"),
    JWT_SECRET: z.string().default(DEFAULT_JWT_SECRET),
  })
  .refine(
    (data) => {
      if (data.NODE_ENV === "production") {
        if (data.JWT_SECRET === DEFAULT_JWT_SECRET) return false;
      }
      return true;
    },
    {
      message:
        "FATAL: JWT_SECRET cannot use default fallback key in production mode!",
      path: ["JWT_SECRET"],
    },
  );

export type EnvConfig = z.infer<typeof envSchema>;

export function loadEnv(
  customEnv?: Record<string, string | undefined>,
): EnvConfig {
  const targetEnv = customEnv || process.env;
  const result = envSchema.safeParse(targetEnv);
  if (!result.success) {
    console.error(
      "❌ Invalid environment configuration:",
      result.error.format(),
    );
    throw new Error("Environment configuration validation failed");
  }
  return result.data;
}

export const env = loadEnv();
