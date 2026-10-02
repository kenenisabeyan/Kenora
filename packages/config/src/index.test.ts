import { describe, it, expect } from "vitest";
import { envSchema } from "./index.js";

describe("Environment Configuration Validation", () => {
  it("should parse valid environment variables with defaults", () => {
    const parsed = envSchema.parse({
      NODE_ENV: "development",
      PORT: "4000",
    });
    expect(parsed.NODE_ENV).toBe("development");
    expect(parsed.PORT).toBe(4000);
    expect(parsed.DATABASE_URL).toBeDefined();
  });

  it("should reject invalid NODE_ENV", () => {
    const result = envSchema.safeParse({
      NODE_ENV: "invalid-env",
    });
    expect(result.success).toBe(false);
  });
});
