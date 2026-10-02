import { describe, it, expect } from "vitest";
import { loadEnv } from "./index.js";

describe("Environment Configuration Validation", () => {
  it("should parse valid development environment with defaults", () => {
    const env = loadEnv({ NODE_ENV: "development" });
    expect(env.NODE_ENV).toBe("development");
    expect(env.PORT).toBe(4000);
    expect(env.DATABASE_URL).toBeDefined();
  });

  it("should reject default JWT_SECRET in production mode", () => {
    expect(() =>
      loadEnv({
        NODE_ENV: "production",
        JWT_SECRET: "super-secret-kenora-jwt-token-key-change-in-production",
      }),
    ).toThrow("Environment configuration validation failed");
  });

  it("should accept custom JWT_SECRET in production mode", () => {
    const env = loadEnv({
      NODE_ENV: "production",
      JWT_SECRET: "a-genuine-custom-production-jwt-secret-key-32-chars-long",
    });
    expect(env.NODE_ENV).toBe("production");
  });
});
