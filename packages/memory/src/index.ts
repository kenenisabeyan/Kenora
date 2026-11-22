import crypto from "node:crypto";

/**
 * Memory Store Contracts (Short-term, Long-term, Agent Episodic Memory)
 * Multi-tenant safe with TTL expiration and type-based retrieval
 */

export interface MemoryRecord {
  id: string;
  tenantId: string;
  agentId?: string;
  userId?: string;
  type: "short_term" | "long_term" | "episodic";
  key: string;
  value: unknown;
  ttlSeconds?: number;
  createdAt: string;
  expiresAt?: string;
}

export interface IMemoryStore {
  get(tenantId: string, key: string): Promise<MemoryRecord | null>;
  set(record: Omit<MemoryRecord, "id" | "createdAt" | "expiresAt">): Promise<MemoryRecord>;
  delete(tenantId: string, key: string): Promise<void>;
  listByAgent(tenantId: string, agentId: string): Promise<MemoryRecord[]>;
}

export class InMemoryMemoryStore implements IMemoryStore {
  private records = new Map<string, MemoryRecord>(); // key: `${tenantId}:${key}`

  async get(tenantId: string, key: string): Promise<MemoryRecord | null> {
    const storeKey = `${tenantId}:${key}`;
    const record = this.records.get(storeKey);
    if (!record) return null;

    // Check TTL expiration
    if (record.expiresAt && new Date(record.expiresAt).getTime() < Date.now()) {
      this.records.delete(storeKey);
      return null;
    }

    return record;
  }

  async set(
    recordInput: Omit<MemoryRecord, "id" | "createdAt" | "expiresAt">,
  ): Promise<MemoryRecord> {
    const storeKey = `${recordInput.tenantId}:${recordInput.key}`;
    const now = new Date();
    const id = `mem-${crypto.randomUUID()}`;

    let expiresAt: string | undefined;
    if (recordInput.ttlSeconds && recordInput.ttlSeconds > 0) {
      expiresAt = new Date(now.getTime() + recordInput.ttlSeconds * 1000).toISOString();
    }

    const record: MemoryRecord = {
      ...recordInput,
      id,
      createdAt: now.toISOString(),
      expiresAt,
    };

    this.records.set(storeKey, record);
    return record;
  }

  async delete(tenantId: string, key: string): Promise<void> {
    const storeKey = `${tenantId}:${key}`;
    this.records.delete(storeKey);
  }

  async listByAgent(tenantId: string, agentId: string): Promise<MemoryRecord[]> {
    const now = Date.now();
    const results: MemoryRecord[] = [];

    for (const record of this.records.values()) {
      if (record.tenantId !== tenantId || record.agentId !== agentId) continue;
      if (record.expiresAt && new Date(record.expiresAt).getTime() < now) continue;
      results.push(record);
    }

    return results;
  }

  clear(): void {
    this.records.clear();
  }
}
