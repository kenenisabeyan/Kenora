import { describe, it, expect, beforeEach } from "vitest";
import { AuthService } from "./auth.service.js";

describe("AuthService (Phase 1 Identity & Authentication)", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  it("should register a new user and create an initial organization with OWNER role", async () => {
    const session = await authService.register({
      name: "Alice Designer",
      organizationName: "Alpha Org",
      email: "alice@alpha.com",
      password: "SecurePassword123!",
    });

    expect(session.sessionId).toBeDefined();
    expect(session.user.email).toBe("alice@alpha.com");
    expect(session.activeOrganization?.name).toBe("Alpha Org");
    expect(session.memberships[0].role).toBe("OWNER");
  });

  it("should reject registration with a duplicate email", async () => {
    await authService.register({
      name: "User 1",
      organizationName: "Org 1",
      email: "duplicate@test.com",
      password: "Password123!",
    });

    await expect(
      authService.register({
        name: "User 2",
        organizationName: "Org 2",
        email: "duplicate@test.com",
        password: "Password123!",
      }),
    ).rejects.toThrow("AUTH_EMAIL_EXISTS");
  });

  it("should authenticate valid login credentials and return session", async () => {
    await authService.register({
      name: "Bob Admin",
      organizationName: "Beta Org",
      email: "bob@beta.com",
      password: "MyStrongPassword123",
    });

    const session = await authService.login({
      email: "bob@beta.com",
      password: "MyStrongPassword123",
    });

    expect(session.user.email).toBe("bob@beta.com");
    expect(session.activeOrganization?.name).toBe("Beta Org");
  });

  it("should reject invalid password with generic error (Account Enumeration Protection)", async () => {
    await authService.register({
      name: "Charlie",
      organizationName: "Gamma Org",
      email: "charlie@gamma.com",
      password: "ValidPassword123",
    });

    await expect(
      authService.login({
        email: "charlie@gamma.com",
        password: "WrongPassword!",
      }),
    ).rejects.toThrow("AUTH_INVALID_CREDENTIALS");
  });

  it("should logout and invalidate session", async () => {
    const session = await authService.register({
      name: "David",
      organizationName: "Delta Org",
      email: "david@delta.com",
      password: "Password123!",
    });

    await authService.logout(session.sessionId);

    await expect(
      authService.validateSession(session.sessionId),
    ).rejects.toThrow("AUTH_SESSION_EXPIRED");
  });

  it("should fail switching to an organization where user is NOT a member", async () => {
    const sessionAlice = await authService.register({
      name: "Alice",
      organizationName: "Alice Org",
      email: "alice@test.com",
      password: "Password123!",
    });

    const sessionBob = await authService.register({
      name: "Bob",
      organizationName: "Bob Org",
      email: "bob@test.com",
      password: "Password123!",
    });

    // Alice attempts to switch active org to Bob's Org ID
    const bobOrgId = sessionBob.activeOrganization!.id;
    await expect(
      authService.switchOrganization(sessionAlice.sessionId, bobOrgId),
    ).rejects.toThrow("ORG_MEMBERSHIP_REQUIRED");
  });
});
