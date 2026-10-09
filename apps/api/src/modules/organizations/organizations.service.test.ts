import { describe, it, expect, beforeEach } from "vitest";
import { AuthService } from "../auth/auth.service.js";
import { OrganizationsService } from "./organizations.service.js";

describe("OrganizationsService & Multi-Tenant Boundaries", () => {
  let authService: AuthService;
  let orgsService: OrganizationsService;

  beforeEach(() => {
    authService = new AuthService();
    orgsService = new OrganizationsService(authService);
  });

  it("should create organization and grant caller OWNER membership", async () => {
    const session = await authService.register({
      email: "alice@orgtest.com",
      password: "Password123!",
      name: "Alice Owner",
      organizationName: "Alpha Corp",
    });

    const newOrgRes = await orgsService.createOrganization(session.sessionId, {
      name: "Beta Ventures",
      slug: "beta-ventures",
    });

    expect(newOrgRes.organization.id).toBeDefined();
    expect(newOrgRes.membership.role).toBe("OWNER");
    expect(newOrgRes.membership.organizationId).toBe(newOrgRes.organization.id);

    const userOrgs = await orgsService.listUserOrganizations(session.sessionId);
    expect(userOrgs.length).toBe(2);
  });

  it("should DENY access when caller attempts to access an organization they do NOT belong to", async () => {
    // Alice creates Org A
    const aliceSession = await authService.register({
      email: "alice@isolated.com",
      password: "Password123!",
      name: "Alice",
      organizationName: "Org Alpha",
    });

    // Bob creates Org B
    const bobSession = await authService.register({
      email: "bob@isolated.com",
      password: "Password123!",
      name: "Bob",
      organizationName: "Org Beta",
    });

    const bobOrgId = bobSession.activeOrganization!.id;

    // Alice attempts to get Org B details -> DENIED
    await expect(
      orgsService.getOrganization(aliceSession.sessionId, bobOrgId),
    ).rejects.toThrow("ORG_MEMBERSHIP_REQUIRED");

    // Alice attempts to list Org B members -> DENIED
    await expect(
      orgsService.listOrganizationMembers(aliceSession.sessionId, bobOrgId),
    ).rejects.toThrow("ORG_MEMBERSHIP_REQUIRED");
  });

  it("should allow OWNER to invite a new member to their organization", async () => {
    const session = await authService.register({
      email: "owner@invite.com",
      password: "Password123!",
      name: "Owner User",
      organizationName: "Invite Corp",
    });

    const orgId = session.activeOrganization!.id;

    const membership = await orgsService.inviteMember(
      session.sessionId,
      orgId,
      {
        email: "member@invite.com",
        role: "MEMBER",
      },
    );

    expect(membership.organizationId).toBe(orgId);
    expect(membership.role).toBe("MEMBER");
    expect(membership.status).toBe("invited");

    const members = await orgsService.listOrganizationMembers(
      session.sessionId,
      orgId,
    );
    expect(members.length).toBe(2);
  });
});
