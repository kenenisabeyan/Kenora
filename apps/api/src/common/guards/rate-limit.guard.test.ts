import { describe, it, expect, vi, beforeEach } from "vitest";
import { Reflector } from "@nestjs/core";
import { RateLimitGuard } from "./rate-limit.guard.js";
import { RateLimiter } from "@kenora/security";
import { HttpException, HttpStatus } from "@nestjs/common";

describe("RateLimitGuard", () => {
  let guard: RateLimitGuard;
  let reflector: Reflector;

  beforeEach(() => {
    RateLimiter.clear();
    reflector = new Reflector();
    guard = new RateLimitGuard(reflector);
  });

  function createMockContext(body: any, options?: any) {
    const request = { body, ip: "127.0.0.1" };
    vi.spyOn(reflector, "getAllAndOverride").mockReturnValue(options);

    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    };
  }

  it("should pass if within rate limit threshold", () => {
    const mockCtx = createMockContext(
      { email: "user@test.com" },
      { keyPrefix: "test", limit: 2, windowMs: 60000 },
    );

    expect(guard.canActivate(mockCtx as any)).toBe(true);
    expect(guard.canActivate(mockCtx as any)).toBe(true);
  });

  it("should throw TOO_MANY_REQUESTS when limit exceeded", () => {
    const mockCtx = createMockContext(
      { email: "spammer@test.com" },
      { keyPrefix: "test", limit: 2, windowMs: 60000 },
    );

    guard.canActivate(mockCtx as any);
    guard.canActivate(mockCtx as any);

    expect(() => guard.canActivate(mockCtx as any)).toThrow(HttpException);
  });
});
