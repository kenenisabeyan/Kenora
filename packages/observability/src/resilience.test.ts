import { describe, it, expect, vi } from "vitest";
import { CircuitBreaker, BackoffRetry } from "./resilience.js";

describe("CircuitBreaker Resilience", () => {
  it("should remain CLOSED on successful executions", async () => {
    const breaker = new CircuitBreaker({ failureThreshold: 2 });
    const result = await breaker.execute(async () => "success");
    expect(result).toBe("success");
    expect(breaker.getState()).toBe("CLOSED");
  });

  it("should transition to OPEN after reaching failure threshold", async () => {
    const breaker = new CircuitBreaker({ failureThreshold: 2, resetTimeoutMs: 50 });

    // Fail 1
    await expect(breaker.execute(async () => { throw new Error("F1"); })).rejects.toThrow("F1");
    expect(breaker.getState()).toBe("CLOSED");

    // Fail 2 -> Reaches threshold
    await expect(breaker.execute(async () => { throw new Error("F2"); })).rejects.toThrow("F2");
    expect(breaker.getState()).toBe("OPEN");

    // Subsequent calls should fail fast with CIRCUIT_BREAKER_OPEN
    await expect(breaker.execute(async () => "test")).rejects.toThrow("CIRCUIT_BREAKER_OPEN");
  });
});

describe("BackoffRetry Resilience", () => {
  it("should succeed without retry if task resolves on first try", async () => {
    const fn = vi.fn().mockResolvedValue("immediate");
    const result = await BackoffRetry.execute(fn, { maxAttempts: 3 });
    expect(result).toBe("immediate");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("should retry on failure and succeed if subsequent attempt passes", async () => {
    let attempt = 0;
    const fn = vi.fn().mockImplementation(async () => {
      attempt++;
      if (attempt === 1) throw new Error("transient network blip");
      return "recovered";
    });

    const result = await BackoffRetry.execute(fn, { maxAttempts: 3, baseDelayMs: 10 });
    expect(result).toBe("recovered");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("should exhaust retries and throw error if all attempts fail", async () => {
    const fn = vi.fn().mockRejectedValue(new Error("persistent failure"));
    await expect(
      BackoffRetry.execute(fn, { maxAttempts: 2, baseDelayMs: 5 }),
    ).rejects.toThrow("persistent failure");
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
