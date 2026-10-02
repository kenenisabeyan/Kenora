import { KnowledgeItemDTO } from '@kenora/types';

/**
 * Knowledge Pipeline Interfaces (Ingestion -> Normalization -> Deduplication -> Extraction -> Verification -> Graph)
 */

export interface NormalizedItem {
  externalId: string;
  sourceType: string;
  title: string;
  body: string;
  url: string;
  author?: string;
  publishedAt?: string;
  metadata: Record<string, unknown>;
}

export interface ExtractedClaim {
  claimText: string;
  subject: string;
  predicate: string;
  object: string;
  confidence: number;
}

export interface ExtractedEntity {
  name: string;
  type: string;
  attributes: Record<string, unknown>;
}

export interface KnowledgePipelineProcessor {
  normalize(rawItem: unknown, adapterType: string): Promise<NormalizedItem>;
  deduplicate(item: NormalizedItem, tenantId: string): Promise<{ isDuplicate: boolean; existingId?: string }>;
  extractClaims(item: NormalizedItem): Promise<ExtractedClaim[]>;
  extractEntities(item: NormalizedItem): Promise<ExtractedEntity[]>;
}
