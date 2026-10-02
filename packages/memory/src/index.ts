/**
 * Memory Store Contracts (Short-term, Long-term, Agent Memory)
 */

export interface MemoryRecord {
  id: string;
  tenantId: string;
  agentId?: string;
  userId?: string;
  type: 'short_term' | 'long_term' | 'episodic';
  key: string;
  value: unknown;
  ttlSeconds?: number;
  createdAt: string;
}

export interface IMemoryStore {
  get(tenantId: string, key: string): Promise<MemoryRecord | null>;
  set(record: Omit<MemoryRecord, 'id' | 'createdAt'>): Promise<MemoryRecord>;
  delete(tenantId: string, key: string): Promise<void>;
}
