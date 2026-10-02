import { describe, it, expect } from "vitest";
import {
  TenantContext,
  AuthorizationService,
  Permissions,
  PasswordHasher,
  ExternalDataSanitizer,
} from "./index.js";

describe("TenantContext (AsyncLocalStorage Isolation)", () => {
  it("should run execution scoped inside tenant context", () => {
    TenantContext.run({ tenantId: "org-alpha" }, () => {
      expect(TenantContext.get()).toBe("org-alpha");
    });
  });

  it("should maintain distinct tenant contexts across concurrent async flows", async () => {
    const p1 = new Promise<string>((resolve) => {
      TenantContext.run({ tenantId: "org-A" }, async () => {
        await new Promise((r) => setTimeout(r, 20));
        resolve(TenantContext.get());
      });
    });

    const p2 = new Promise<string>((resolve) => {
      TenantContext.run({ tenantId: "org-B" }, async () => {
        await new Promise((r) => setTimeout(r, 10));
        resolve(TenantContext.get());
      });
    });

    const [t1, t2] = await Promise.all([p1, p2]);
    expect(t1).toBe("org-A");
    expect(t2).toBe("org-B");
  });

  it("should throw error when getting context outside run scope", () => {
    expect(() => TenantContext.get()).toThrow("TenantContext error");
  });
});

describe("AuthorizationService (RBAC & Multi-Tenant Isolation)", () => {
  const orgA = "org-111";
  const orgB = "org-222";

  it("should allow OWNER to perform organization:update within their organization", () => {
    const isAllowed = AuthorizationService.can(
      "OWNER",
      Permissions.ORG_UPDATE,
      orgA,
      { organizationId: orgA },
    );
    expect(isAllowed).toBe(true);
  });

  it("should DENY MEMBER from performing organization:update", () => {
    const isAllowed = AuthorizationService.can(
      "MEMBER",
      Permissions.ORG_UPDATE,
      orgA,
      { organizationId: orgA },
    );
    expect(isAllowed).toBe(false);
  });

  it("should DENY access when active organization does NOT match resource organization (Multi-Tenant Boundary)", () => {
    // Alice in Org A attempts to access Org B resource
    const isAllowed = AuthorizationService.can(
      "OWNER",
      Permissions.PROJECT_READ,
      orgA,
      { organizationId: orgB },
    );
    expect(isAllowed).toBe(false);
  });

  it("should throw AUTH_FORBIDDEN on authorize failure", () => {
    expect(() =>
      AuthorizationService.authorize("MEMBER", Permissions.ORG_DELETE, orgA, {
        organizationId: orgA,
      }),
    ).toThrow("AUTH_FORBIDDEN");
  });
});

describe("PasswordHasher", () => {
  it("should hash password and verify correct password", async () => {
    const raw = "SecureP@ssw0rd2026";
    const hashed = await PasswordHasher.hash(raw);

    expect(hashed).not.toBe(raw);
    expect(await PasswordHasher.compare(raw, hashed)).toBe(true);
    expect(await PasswordHasher.compare("WrongPassword", hashed)).toBe(false);
  });

  it("should reject passwords shorter than 8 characters", async () => {
    await expect(PasswordHasher.hash("short")).rejects.toThrow(
      "at least 8 characters",
    );
  });
});

describe("ExternalDataSanitizer", () => {
  it("should strip script tags and control characters", () => {
    const malicious = "Safe Text <script>alert(1)</script>";
    expect(ExternalDataSanitizer.sanitizeText(malicious)).toBe("Safe Text");
  });
});
