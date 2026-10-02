import { KnowledgeItemDTO } from "@kenora/types";

export interface SourceCapabilities {
  supportsRealtime: boolean;
  supportsHistoricalBackfill: boolean;
  supportsFullText: boolean;
  rateLimitPerMinute: number;
}

export interface SourceHealth {
  status: "healthy" | "degraded" | "unhealthy";
  lastCheckedAt: string;
  errorMessage?: string;
}

export interface SourceItem {
  externalId: string;
  title: string;
  content: string;
  url: string;
  author?: string;
  publishedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface ISourceAdapter {
  readonly adapterType: string;
  getCapabilities(): SourceCapabilities;
  checkHealth(): Promise<SourceHealth>;
  fetchLatest(sourceUrl: string, since?: Date): Promise<SourceItem[]>;
}
