import {
  UserDTO,
  OrganizationDTO,
  MembershipDTO,
  AuthSessionDTO,
  KnowledgeItemDTO,
  SourceDTO,
  BriefingDTO,
} from "@kenora/types";

/**
 * Domain Models & Domain Contracts for Kenora
 * Source-Agnostic & Multi-Tenant Core Specifications
 */

export class TenantId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("TenantId cannot be empty");
    }
  }
}

export class UserId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("UserId cannot be empty");
    }
  }
}

export class OrganizationId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("OrganizationId cannot be empty");
    }
  }
}

export class SessionId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("SessionId cannot be empty");
    }
  }
}

export class MembershipId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error("MembershipId cannot be empty");
    }
  }
}

export class KnowledgeItemId {
  constructor(public readonly value: string) {}
}

export class SourceId {
  constructor(public readonly value: string) {}
}

/**
 * Identity & Access Repositories
 */
export interface IUserRepository {
  findById(id: UserId): Promise<UserDTO | null>;
  findByEmail(email: string): Promise<UserDTO | null>;
  save(user: UserDTO): Promise<UserDTO>;
}

export interface IOrganizationRepository {
  findById(id: OrganizationId): Promise<OrganizationDTO | null>;
  findBySlug(slug: string): Promise<OrganizationDTO | null>;
  save(org: OrganizationDTO): Promise<OrganizationDTO>;
  listByUser(userId: UserId): Promise<OrganizationDTO[]>;
}

export interface IMembershipRepository {
  findById(id: MembershipId): Promise<MembershipDTO | null>;
  findUserMemberships(userId: UserId): Promise<MembershipDTO[]>;
  findUserOrgMembership(
    userId: UserId,
    organizationId: OrganizationId,
  ): Promise<MembershipDTO | null>;
  save(membership: MembershipDTO): Promise<MembershipDTO>;
}

export interface ISessionRepository {
  findByToken(token: string): Promise<AuthSessionDTO | null>;
  save(session: AuthSessionDTO): Promise<AuthSessionDTO>;
  revoke(token: string): Promise<void>;
  revokeAllUserSessions(userId: UserId, exceptToken?: string): Promise<void>;
}

export interface IKnowledgeItemRepository {
  findById(
    id: KnowledgeItemId,
    tenantId: TenantId,
  ): Promise<KnowledgeItemDTO | null>;
  save(item: KnowledgeItemDTO): Promise<KnowledgeItemDTO>;
  listByTenant(
    tenantId: TenantId,
    limit: number,
    offset: number,
  ): Promise<KnowledgeItemDTO[]>;
}

export interface ISourceRepository {
  findById(id: SourceId, tenantId: TenantId): Promise<SourceDTO | null>;
  save(source: SourceDTO): Promise<SourceDTO>;
  listActive(tenantId: TenantId): Promise<SourceDTO[]>;
}

export interface IBriefingRepository {
  findById(id: string, tenantId: TenantId): Promise<BriefingDTO | null>;
  save(briefing: BriefingDTO): Promise<BriefingDTO>;
}
