import { AsyncLocalStorage } from "node:async_hooks";
import bcrypt from "bcryptjs";

/**
 * Tenant Context Interface
 */
export interface ITenantStore {
  tenantId: string;
  userId?: string;
  roles?: string[];
  correlationId?: string;
}

/**
 * Request-Scoped & Job-Scoped Tenant Context Store using AsyncLocalStorage
 * Prevents cross-request static memory pollution in concurrent async Node.js loops.
 */
const tenantStorage = new AsyncLocalStorage<ITenantStore>();

export class TenantContext {
  /**
   * Run a callback scoped within a specific tenant context
   */
  static run<T>(store: ITenantStore, callback: () => T): T {
    if (!store.tenantId || store.tenantId.trim() === "") {
      throw new Error("TenantContext error: Invalid or empty tenantId");
    }
    return tenantStorage.run(store, callback);
  }

  /**
   * Get the current request or worker job's tenant ID
   */
  static get(): string {
    const store = tenantStorage.getStore();
    if (!store || !store.tenantId) {
      throw new Error(
        "TenantContext error: No active tenant context bound to execution chain",
      );
    }
    return store.tenantId;
  }

  /**
   * Get full execution context store (tenant, user, correlation ID)
   */
  static getStore(): ITenantStore | undefined {
    return tenantStorage.getStore();
  }
}

/**
 * Roles & Permission Vocabulary
 */
export type Role = "OWNER" | "ADMIN" | "MEMBER";

export const Permissions = {
  ORG_READ: "organization:read",
  ORG_UPDATE: "organization:update",
  ORG_DELETE: "organization:delete",
  MEMBER_READ: "member:read",
  MEMBER_INVITE: "member:invite",
  MEMBER_UPDATE: "member:update",
  MEMBER_REMOVE: "member:remove",
  PROJECT_READ: "project:read",
  PROJECT_CREATE: "project:create",
  PROJECT_UPDATE: "project:update",
  PROJECT_DELETE: "project:delete",
  KNOWLEDGE_READ: "knowledge:read",
  KNOWLEDGE_CREATE: "knowledge:create",
  KNOWLEDGE_UPDATE: "knowledge:update",
  AGENT_READ: "agent:read",
  AGENT_EXECUTE: "agent:execute",
  MEMORY_READ: "memory:read",
  MEMORY_WRITE: "memory:write",
  SETTINGS_READ: "settings:read",
  SETTINGS_UPDATE: "settings:update",
} as const;

export type Permission = (typeof Permissions)[keyof typeof Permissions];

/**
 * RBAC Permission Matrix
 */
const RolePermissionMatrix: Record<Role, Permission[]> = {
  OWNER: Object.values(Permissions),
  ADMIN: [
    Permissions.ORG_READ,
    Permissions.ORG_UPDATE,
    Permissions.MEMBER_READ,
    Permissions.MEMBER_INVITE,
    Permissions.MEMBER_UPDATE,
    Permissions.PROJECT_READ,
    Permissions.PROJECT_CREATE,
    Permissions.PROJECT_UPDATE,
    Permissions.PROJECT_DELETE,
    Permissions.KNOWLEDGE_READ,
    Permissions.KNOWLEDGE_CREATE,
    Permissions.KNOWLEDGE_UPDATE,
    Permissions.AGENT_READ,
    Permissions.AGENT_EXECUTE,
    Permissions.MEMORY_READ,
    Permissions.MEMORY_WRITE,
    Permissions.SETTINGS_READ,
    Permissions.SETTINGS_UPDATE,
  ],
  MEMBER: [
    Permissions.ORG_READ,
    Permissions.MEMBER_READ,
    Permissions.PROJECT_READ,
    Permissions.KNOWLEDGE_READ,
    Permissions.AGENT_READ,
    Permissions.MEMORY_READ,
  ],
};

export interface ResourceRef {
  organizationId: string;
  resourceId?: string;
}

/**
 * Centralized Authorization Service
 * Server-side authorization check enforcing: authenticated && member_of_org && has_permission && resource_belongs_to_org
 */
export class AuthorizationService {
  /**
   * Authorizes whether an actor in a given organization has permission to act on a target resource
   */
  static can(
    role: Role,
    requiredPermission: Permission,
    activeOrgId: string,
    resource: ResourceRef,
  ): boolean {
    if (!activeOrgId || !resource.organizationId) {
      return false;
    }

    // Strict Tenant / Organization Isolation Boundary Check
    if (activeOrgId !== resource.organizationId) {
      return false;
    }

    const grantedPermissions = RolePermissionMatrix[role] || [];
    return grantedPermissions.includes(requiredPermission);
  }

  /**
   * Throws forbidden exception if authorization fails
   */
  static authorize(
    role: Role,
    requiredPermission: Permission,
    activeOrgId: string,
    resource: ResourceRef,
  ): void {
    if (!this.can(role, requiredPermission, activeOrgId, resource)) {
      throw new Error(
        `AUTH_FORBIDDEN: Insufficient permissions for action '${requiredPermission}' on target resource`,
      );
    }
  }
}

/**
 * Production Password Hashing Utility using bcrypt
 */
export class PasswordHasher {
  private static readonly SALT_ROUNDS = 12;

  static async hash(password: string): Promise<string> {
    if (!password || password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async compare(plainText: string, hashed: string): Promise<boolean> {
    if (!plainText || !hashed) return false;
    return bcrypt.compare(plainText, hashed);
  }
}

/**
 * Untrusted Data Boundary Sanitizer
 * Note: Handles text markup/control character cleanup. Prompt injection defense requires instruction/data separation boundaries.
 */
export class ExternalDataSanitizer {
  static sanitizeText(input: string): string {
    if (!input) return "";
    return input
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .trim();
  }

  static wrapUntrustedData(data: string): string {
    const cleanData = this.sanitizeText(data);
    return `<untrusted_external_content>\n${cleanData}\n</untrusted_external_content>`;
  }
}
