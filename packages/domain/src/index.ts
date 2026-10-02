import { KnowledgeItemDTO, SourceDTO, BriefingDTO } from '@kenora/types';

/**
 * Domain Models & Domain Contracts for Kenora
 * Source-Agnostic Core Principles
 */

export class TenantId {
  constructor(public readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('TenantId cannot be empty');
    }
  }
}

export class KnowledgeItemId {
  constructor(public readonly value: string) {}
}

export class SourceId {
  constructor(public readonly value: string) {}
}

export interface IKnowledgeItemRepository {
  findById(id: KnowledgeItemId, tenantId: TenantId): Promise<KnowledgeItemDTO | null>;
  save(item: KnowledgeItemDTO): Promise<KnowledgeItemDTO>;
  listByTenant(tenantId: TenantId, limit: number, offset: number): Promise<KnowledgeItemDTO[]>;
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
