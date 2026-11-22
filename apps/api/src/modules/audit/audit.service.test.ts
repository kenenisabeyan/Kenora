import { describe, it, expect, beforeEach } from "vitest";
import { AuditService } from "./audit.service.js";
import { AuditLogger } from "@kenora/security";

describe("AuditService & Compliance Transparency Ledger", () => {
  let auditService: AuditService;

  beforeEach(() => {
    AuditLogger.clear();
    auditService = new AuditService();
  });

  it("should record and list audit events for active organization", async () => {
    const orgId = "org-audit-alpha";

    auditService.logEvent({
      eventType: "user.login.success",
      actorId: "usr-1",
      organizationId: orgId,
      outcome: "success",
      metadata: { ip: "127.0.0.1" },
    });

    auditService.logEvent({
      eventType: "organization.created",
      actorId: "usr-1",
      organizationId: orgId,
      outcome: "success",
    });

    const logs = await auditService.listAuditLogs(orgId, { page: 1, limit: 10 });
    expect(logs.total).toBe(2);
    expect(logs.data.length).toBe(2);
    expect(logs.data[0].eventType).toBe("user.login.success");
  });

  it("should filter audit events by eventType", async () => {
    const orgId = "org-audit-beta";

    auditService.logEvent({
      eventType: "user.login.success",
      actorId: "usr-2",
      organizationId: orgId,
      outcome: "success",
    });

    auditService.logEvent({
      eventType: "user.password.changed",
      actorId: "usr-2",
      organizationId: orgId,
      outcome: "success",
    });

    const filtered = await auditService.listAuditLogs(orgId, {
      eventType: "user.password.changed",
    });

    expect(filtered.total).toBe(1);
    expect(filtered.data[0].eventType).toBe("user.password.changed");
  });

  it("should maintain strict tenant isolation across organizations", async () => {
    auditService.logEvent({
      eventType: "membership.created",
      organizationId: "org-tenant-A",
      outcome: "success",
    });

    auditService.logEvent({
      eventType: "membership.created",
      organizationId: "org-tenant-B",
      outcome: "success",
    });

    const logsTenantA = await auditService.listAuditLogs("org-tenant-A");
    expect(logsTenantA.total).toBe(1);
    expect(logsTenantA.data[0].organizationId).toBe("org-tenant-A");
  });

  it("should maintain cryptographic hash-chain integrity across recorded events", () => {
    auditService.logEvent({
      eventType: "user.login.success",
      actorId: "usr-1",
      outcome: "success",
    });

    auditService.logEvent({
      eventType: "user.password.changed",
      actorId: "usr-1",
      outcome: "success",
    });

    const report = auditService.verifyLedgerIntegrity();
    expect(report.isValid).toBe(true);
    expect(report.totalRecords).toBe(2);
    expect(report.rootHash).not.toBe("0".repeat(64));
  });

  it("should automatically redact secrets in audit metadata", () => {
    const logged = auditService.logEvent({
      eventType: "user.login.success",
      outcome: "success",
      metadata: {
        token: "ghp_1234567890abcdef1234567890abcdef1234",
      },
    });

    expect(JSON.stringify(logged.metadata)).toContain("[REDACTED_GITHUB_TOKEN]");
    expect(JSON.stringify(logged.metadata)).not.toContain("ghp_1234567890abcdef");
  });
});
