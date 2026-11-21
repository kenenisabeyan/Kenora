import { describe, it, expect, vi, beforeEach } from "vitest";
import { Reflector } from "@nestjs/core";
import { SessionAuthGuard } from "./session-auth.guard.js";
import { AuthService } from "../../modules/auth/auth.service.js";
import { UnauthorizedException } from "@nestjs/common";

describe("SessionAuthGuard", () => {
  let guard: SessionAuthGuard;
  let authService: AuthService;
  let reflector: Reflector;

  beforeEach(() => {
    authService = new AuthService();
    reflector = new Reflector();
    guard = new SessionAuthGuard(authService, reflector);
  });

  function createMockContext(authHeader?: string, isPublic = false) {
    const request: any = {
      headers: {
        authorization: authHeader,
      },
    };

    vi.spyOn(reflector, "getAllAndOverride").mockReturnValue(isPublic);

    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
      request,
    };
  }

  it("should allow request if route is marked @Public()", async () => {
    const mockCtx = createMockContext(undefined, true);
    const result = await guard.canActivate(mockCtx as any);
    expect(result).toBe(true);
  });

  it("should throw UnauthorizedException if token is missing and route is not public", async () => {
    const mockCtx = createMockContext(undefined, false);
    await expect(guard.canActivate(mockCtx as any)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("should validate Bearer token and attach session to request", async () => {
    const registered = await authService.register({
      name: "Guard Tester",
      organizationName: "Guard Org",
      email: "guard@test.com",
      password: "Password123!",
    });

    const mockCtx = createMockContext(`Bearer ${registered.sessionId}`, false);
    const result = await guard.canActivate(mockCtx as any);

    expect(result).toBe(true);
    expect(mockCtx.request.session).toBeDefined();
    expect(mockCtx.request.user.email).toBe("guard@test.com");
    expect(mockCtx.request.activeOrganizationId).toBeDefined();
  });
});
