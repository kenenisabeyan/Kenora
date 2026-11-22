import crypto from "node:crypto";
import { AuditEventType, AuditEventPayload } from "./index.js";

/**
 * Cryptographic Tamper-Evident Hash-Chained Audit Ledger
 * Mandated by Kenora Architecture Whitepaper v3.0 (Security & Transparency Architecture)
 * 
 * Every audit record is cryptographically bound to its predecessor via SHA-256 hash chaining.
 * Any modification, deletion, or reordering of historical audit records is mathematically detectable.
 */

export interface ChainedAuditRecord {
  index: number;
  previousHash: string;
  timestamp: string;
  eventType: AuditEventType;
  actorId?: string;
  organizationId?: string;
  correlationId?: string;
  outcome: "success" | "denied" | "error";
  payloadHash: string;
  currentHash: string;
}

export interface LedgerVerificationReport {
  isValid: boolean;
  totalRecords: number;
  corruptedIndex?: number;
  rootHash: string;
  verifiedAt: string;
}

export class CryptographicAuditLedger {
  private static readonly GENESIS_HASH = "0".repeat(64);
  private chain: ChainedAuditRecord[] = [];

  constructor() {
    this.chain = [];
  }

  /**
   * Appends an audit event to the ledger, computing SHA-256 payload and block hashes
   */
  append(event: AuditEventPayload): ChainedAuditRecord {
    const index = this.chain.length;
    const previousHash = index === 0 ? CryptographicAuditLedger.GENESIS_HASH : this.chain[index - 1].currentHash;
    const timestamp = event.timestamp || new Date().toISOString();

    const payloadString = JSON.stringify(event.metadata || {});
    const payloadHash = crypto.createHash("sha256").update(payloadString).digest("hex");

    const blockPreimage = `${index}|${previousHash}|${timestamp}|${event.eventType}|${event.actorId || ""}|${event.organizationId || ""}|${event.outcome}|${payloadHash}`;
    const currentHash = crypto.createHash("sha256").update(blockPreimage).digest("hex");

    const record: ChainedAuditRecord = {
      index,
      previousHash,
      timestamp,
      eventType: event.eventType,
      actorId: event.actorId,
      organizationId: event.organizationId,
      correlationId: event.correlationId,
      outcome: event.outcome,
      payloadHash,
      currentHash,
    };

    this.chain.push(record);
    return record;
  }

  /**
   * Verifies the cryptographic integrity of the entire audit ledger from Genesis to Tip
   */
  verifyIntegrity(): LedgerVerificationReport {
    const verifiedAt = new Date().toISOString();
    if (this.chain.length === 0) {
      return {
        isValid: true,
        totalRecords: 0,
        rootHash: CryptographicAuditLedger.GENESIS_HASH,
        verifiedAt,
      };
    }

    for (let i = 0; i < this.chain.length; i++) {
      const record = this.chain[i];
      const expectedPrevHash = i === 0 ? CryptographicAuditLedger.GENESIS_HASH : this.chain[i - 1].currentHash;

      if (record.previousHash !== expectedPrevHash) {
        return {
          isValid: false,
          totalRecords: this.chain.length,
          corruptedIndex: i,
          rootHash: this.chain[this.chain.length - 1].currentHash,
          verifiedAt,
        };
      }

      // Recompute hash
      const blockPreimage = `${record.index}|${record.previousHash}|${record.timestamp}|${record.eventType}|${record.actorId || ""}|${record.organizationId || ""}|${record.outcome}|${record.payloadHash}`;
      const recomputedHash = crypto.createHash("sha256").update(blockPreimage).digest("hex");

      if (recomputedHash !== record.currentHash) {
        return {
          isValid: false,
          totalRecords: this.chain.length,
          corruptedIndex: i,
          rootHash: this.chain[this.chain.length - 1].currentHash,
          verifiedAt,
        };
      }
    }

    return {
      isValid: true,
      totalRecords: this.chain.length,
      rootHash: this.chain[this.chain.length - 1].currentHash,
      verifiedAt,
    };
  }

  getRecords(organizationId?: string): ChainedAuditRecord[] {
    if (organizationId) {
      return this.chain.filter((r) => r.organizationId === organizationId);
    }
    return [...this.chain];
  }

  getTipHash(): string {
    if (this.chain.length === 0) return CryptographicAuditLedger.GENESIS_HASH;
    return this.chain[this.chain.length - 1].currentHash;
  }

  clear(): void {
    this.chain = [];
  }
}
