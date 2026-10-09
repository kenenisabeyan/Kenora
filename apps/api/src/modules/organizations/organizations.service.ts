import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { OrganizationDTO, MembershipDTO } from "@kenora/types";
import { CreateOrgInput, InviteMemberInput } from "@kenora/api-contracts";
import { AuthorizationService, Permissions, AuditLogger } from "@kenora/security";
import { AuthService } from "../auth/auth.service.js";
import crypto from "node:crypto";

@Injectable()
export class OrganizationsService {
  constructor(private readonly authService: AuthService) {}

  async listUserOrganizations(sessionToken: string): Promise<OrganizationDTO[]> {
    const session = await this.authService.validateSession(sessionToken);
    const orgIds = session.memberships.map((m) => m.organizationId);
    const orgs: OrganizationDTO[] = [];
    for (const orgId of orgIds) {
      const org = this.authService.getOrganization(orgId);
      if (org) orgs.push(org);
    }
    return orgs;
  }

  async getOrganization(
    sessionToken: string,
    organizationId: string,
  ): Promise<OrganizationDTO> {
    const session = await this.authService.validateSession(sessionToken);
    const membership = session.memberships.find(
      (m) => m.organizationId === organizationId,
    );
    if (!membership) {
      throw new ForbiddenException(
        "ORG_MEMBERSHIP_REQUIRED: Caller is not a member of requested organization",
      );
    }
    const org = this.authService.getOrganization(organizationId);
    if (!org) {
      throw new NotFoundException("ORG_NOT_FOUND: Organization not found");
    }
    return org;
  }

  async createOrganization(
    sessionToken: string,
    input: CreateOrgInput,
  ): Promise<{ organization: OrganizationDTO; membership: MembershipDTO }> {
    const session = await this.authService.validateSession(sessionToken);

    // Uniqueness check for slug
    const existingOrg = this.authService.getOrganizationBySlug(input.slug);
    if (existingOrg) {
      throw new BadRequestException(
        "ORG_SLUG_EXISTS: An organization with this slug already exists",
      );
    }

    const orgId = `org-${crypto.randomUUID()}`;
    const newOrg: OrganizationDTO = {
      id: orgId,
      name: input.name,
      slug: input.slug,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.authService.addOrganization(newOrg);

    const membershipId = `mem-${crypto.randomUUID()}`;
    const newMembership: MembershipDTO = {
      id: membershipId,
      userId: session.user.id,
      organizationId: orgId,
      role: "OWNER",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.authService.addMembership(newMembership);

    AuditLogger.log({
      eventType: "organization.created",
      actorId: session.user.id,
      organizationId: orgId,
      outcome: "success",
    });

    return { organization: newOrg, membership: newMembership };
  }

  async listOrganizationMembers(
    sessionToken: string,
    organizationId: string,
  ): Promise<MembershipDTO[]> {
    const session = await this.authService.validateSession(sessionToken);
    const callerMembership = session.memberships.find(
      (m) => m.organizationId === organizationId,
    );

    if (!callerMembership) {
      throw new ForbiddenException(
        "ORG_MEMBERSHIP_REQUIRED: Caller is not a member of target organization",
      );
    }

    // Authorize member:read permission
    AuthorizationService.authorize(
      callerMembership.role,
      Permissions.MEMBER_READ,
      organizationId,
      { organizationId },
    );

    return this.authService.getOrganizationMemberships(organizationId);
  }

  async inviteMember(
    sessionToken: string,
    organizationId: string,
    input: InviteMemberInput,
  ): Promise<MembershipDTO> {
    const session = await this.authService.validateSession(sessionToken);
    const callerMembership = session.memberships.find(
      (m) => m.organizationId === organizationId,
    );

    if (!callerMembership) {
      throw new ForbiddenException("ORG_MEMBERSHIP_REQUIRED");
    }

    AuthorizationService.authorize(
      callerMembership.role,
      Permissions.MEMBER_INVITE,
      organizationId,
      { organizationId },
    );

    // Find or create user invite
    const invitedUser = this.authService.findUserByEmail(input.email);
    const invitedUserId = invitedUser ? invitedUser.id : `usr-invited-${crypto.randomUUID()}`;

    const membershipId = `mem-${crypto.randomUUID()}`;
    const membership: MembershipDTO = {
      id: membershipId,
      userId: invitedUserId,
      organizationId,
      role: input.role,
      status: "invited",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.authService.addMembership(membership);

    AuditLogger.log({
      eventType: "membership.created",
      actorId: session.user.id,
      organizationId,
      outcome: "success",
      metadata: { invitedEmail: input.email, role: input.role },
    });

    return membership;
  }
}
