import { describe, it, expect, beforeEach } from "vitest";
import { CryptographicAuditLedger } from "./audit-ledger";

describe("Cryptographic Tamper-Evident Audit Ledger", () => {
  let ledger: CryptographicAuditLedger;

  beforeEach(() => {
    ledger = new CryptographicAuditLedger();
  });

  it("should append audit records with continuous SHA-256 hash chaining", () => {
    const record0 = ledger.append({
      eventType: "user.login.success",
      actorId: "usr_alice",
      organizationId: "org_1",
      outcome: "success",
      metadata: { ip: "127.0.0.1" },
    });

    const record1 = ledger.append({
      eventType: "organization.context.changed",
      actorId: "usr_alice",
      organizationId: "org_2",
      outcome: "success",
      metadata: { previousOrg: "org_1" },
    });

    expect(record0.index).toBe(0);
    expect(record0.previousHash).toBe("0".repeat(64));
    expect(record1.index).toBe(1);
    expect(record1.previousHash).toBe(record0.currentHash);

    const report = ledger.verifyIntegrity();
    expect(report.isValid).toBe(true);
    expect(report.totalRecords).toBe(2);
    expect(report.rootHash).toBe(record1.currentHash);
  });

  it("should detect any illicit tampering or record mutation", () => {
    ledger.append({
      eventType: "user.login.success",
      actorId: "usr_alice",
      outcome: "success",
    });

    ledger.append({
      eventType: "membership.created",
      actorId: "usr_admin",
      outcome: "success",
    });

    // Tamper with record 0 directly in chain
    const records = ledger.getRecords();
    records[0].eventType = "user.login.failed"; // Unauthorized modification

    const report = ledger.verifyIntegrity();
    expect(report.isValid).toBe(false);
    expect(report.corruptedIndex).toBe(0);
  });
});
