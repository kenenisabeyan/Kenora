import { AsyncLocalStorage } from "node:async_hooks";
import bcrypt from "bcryptjs";
import crypto from "node:crypto";

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
 */
const tenantStorage = new AsyncLocalStorage<ITenantStore>();

export class TenantContext {
  static run<T>(store: ITenantStore, callback: () => T): T {
    if (!store.tenantId || store.tenantId.trim() === "") {
      throw new Error("TenantContext error: Invalid or empty tenantId");
    }
    return tenantStorage.run(store, callback);
  }

  static get(): string {
    const store = tenantStorage.getStore();
    if (!store || !store.tenantId) {
      throw new Error(
        "TenantContext error: No active tenant context bound to execution chain",
      );
    }
    return store.tenantId;
  }

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

export class AuthorizationService {
  static can(
    role: Role,
    requiredPermission: Permission,
    activeOrgId: string,
    resource: ResourceRef,
  ): boolean {
    if (!activeOrgId || !resource.organizationId) {
      return false;
    }
    if (activeOrgId !== resource.organizationId) {
      return false;
    }
    const grantedPermissions = RolePermissionMatrix[role] || [];
    return grantedPermissions.includes(requiredPermission);
  }

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

export class PasswordHasher {
  private static readonly SALT_ROUNDS = process.env.NODE_ENV === "test" ? 4 : 12;

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
 * Sliding Window In-Memory / Redis Rate Limiter Foundation
 */
export class RateLimiter {
  private static hits = new Map<string, number[]>();

  static isAllowed(
    key: string,
    limit: number,
    windowMs: number,
  ): { allowed: boolean; remaining: number; resetMs: number } {
    const now = Date.now();
    const timestamps = (this.hits.get(key) || []).filter(
      (t) => now - t < windowMs,
    );

    if (timestamps.length >= limit) {
      const oldestHit = timestamps[0];
      const resetMs = oldestHit + windowMs - now;
      return { allowed: false, remaining: 0, resetMs };
    }

    timestamps.push(now);
    this.hits.set(key, timestamps);
    return {
      allowed: true,
      remaining: limit - timestamps.length,
      resetMs: windowMs,
    };
  }

  static clear(): void {
    this.hits.clear();
  }
}

/**
 * Cryptographic Token & CSRF Strategy
 */
export class CsrfProtection {
  static generateToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  static verifyToken(clientToken: string, cookieToken: string): boolean {
    if (!clientToken || !cookieToken) return false;
    if (clientToken.length !== cookieToken.length) return false;
    return crypto.timingSafeEqual(
      Buffer.from(clientToken),
      Buffer.from(cookieToken),
    );
  }
}

/**
 * Audit Logging Event Vocabulary & Security Logger
 */
export type AuditEventType =
  | "user.registered"
  | "user.login.success"
  | "user.login.failed"
  | "user.logout"
  | "user.email.verified"
  | "user.password.reset.requested"
  | "user.password.changed"
  | "organization.created"
  | "membership.created"
  | "membership.updated"
  | "membership.removed"
  | "organization.context.changed";

export interface AuditEventPayload {
  eventType: AuditEventType;
  actorId?: string;
  organizationId?: string;
  correlationId?: string;
  ipAddress?: string;
  outcome: "success" | "denied" | "error";
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

export class AuditLogger {
  private static events: AuditEventPayload[] = [];

  static log(event: AuditEventPayload): AuditEventPayload {
    const record: AuditEventPayload = {
      ...event,
      timestamp: event.timestamp || new Date().toISOString(),
    };
    this.events.push(record);
    if (process.env.NODE_ENV !== "test") {
      console.log(
        `[AUDIT EVENT] Type: ${record.eventType} | Actor: ${record.actorId || "anon"} | Org: ${record.organizationId || "none"} | Outcome: ${record.outcome}`,
      );
    }
    return record;
  }

  static getEvents(organizationId?: string): AuditEventPayload[] {
    if (organizationId) {
      return this.events.filter((e) => e.organizationId === organizationId);
    }
    return [...this.events];
  }

  static clear(): void {
    this.events = [];
  }
}

/**
 * Production Email Service Abstraction
 */
export interface SendEmailPayload {
  to: string;
  subject: string;
  template: "email_verification" | "password_reset" | "security_alert";
  variables: Record<string, string>;
}

export interface IEmailService {
  sendEmail(
    payload: SendEmailPayload,
  ): Promise<{ success: boolean; messageId: string }>;
}

/**
 * Development-Only Log Email Service Provider
 */
export class DevelopmentEmailService implements IEmailService {
  async sendEmail(
    payload: SendEmailPayload,
  ): Promise<{ success: boolean; messageId: string }> {
    const messageId = `dev-msg-${Date.now()}`;
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "test"
    ) {
      console.log(
        `[DEV EMAIL SERVICE PROVIDER] To: ${payload.to} | Subject: ${payload.subject} | MessageID: ${messageId}`,
      );
    }
    return { success: true, messageId };
  }
}

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
