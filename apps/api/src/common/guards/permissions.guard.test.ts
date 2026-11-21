import { describe, it, expect, vi, beforeEach } from "vitest";
import { Reflector } from "@nestjs/core";
import { PermissionsGuard } from "./permissions.guard.js";
import { Permissions } from "@kenora/security";
import { ForbiddenException } from "@nestjs/common";

describe("PermissionsGuard", () => {
  let guard: PermissionsGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new PermissionsGuard(reflector);
  });

  function createMockContext(session: any, params: any = {}, requiredPerm?: any) {
    const request: any = {
      session,
      params,
      activeOrganizationId: session?.activeOrganization?.id,
    };

    vi.spyOn(reflector, "getAllAndOverride").mockReturnValue(requiredPerm);

    return {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
      request,
    };
  }

  it("should allow access when no permission is required", () => {
    const mockCtx = createMockContext(undefined, {}, undefined);
    expect(guard.canActivate(mockCtx as any)).toBe(true);
  });

  it("should allow OWNER to access member:invite permission", () => {
    const orgId = "org-alpha-123";
    const session = {
      activeOrganization: { id: orgId },
      memberships: [{ organizationId: orgId, role: "OWNER" }],
    };

    const mockCtx = createMockContext(session, { id: orgId }, Permissions.MEMBER_INVITE);
    expect(guard.canActivate(mockCtx as any)).toBe(true);
  });

  it("should deny MEMBER from member:invite action", () => {
    const orgId = "org-beta-456";
    const session = {
      activeOrganization: { id: orgId },
      memberships: [{ organizationId: orgId, role: "MEMBER" }],
    };

    const mockCtx = createMockContext(session, { id: orgId }, Permissions.MEMBER_INVITE);
    expect(() => guard.canActivate(mockCtx as any)).toThrow();
  });
});
