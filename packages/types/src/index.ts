/**
 * Shared Type Definitions for Kenora Monorepo
 */

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  path?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
  meta?: {
    requestId?: string;
    timestamp: string;
    version: string;
  };
}

export interface KnowledgeItemDTO {
  id: string;
  tenantId: string;
  sourceId: string;
  externalId?: string;
  title: string;
  content: string;
  contentType:
    "article" | "paper" | "code" | "video" | "discussion" | "advisory";
  url: string;
  author?: string;
  publishedAt?: string;
  confidenceScore: number;
  verificationStatus: "unverified" | "verified" | "refuted" | "inconclusive";
  tags: string[];
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface SourceDTO {
  id: string;
  tenantId: string;
  name: string;
  adapterType: string;
  url: string;
  status: "active" | "paused" | "error" | "deprecated";
  pollingIntervalSeconds: number;
  lastPolledAt?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface BriefingDTO {
  id: string;
  tenantId: string;
  userId: string;
  title: string;
  summary: string;
  items: KnowledgeItemDTO[];
  generatedAt: string;
  readStatus: "unread" | "read" | "archived";
  metadata: Record<string, unknown>;
}

export interface AgentDTO {
  id: string;
  tenantId: string;
  name: string;
  type: string;
  status: "idle" | "running" | "paused" | "failed";
  capabilities: string[];
  lastActiveAt?: string;
  metadata: Record<string, unknown>;
}

export interface HealthCheckStatus {
  status: "ok" | "degraded" | "error";
  version: string;
  timestamp: string;
  services: {
    database: { status: "ok" | "error"; latencyMs?: number };
    redis: { status: "ok" | "error"; latencyMs?: number };
    nats: { status: "ok" | "error"; latencyMs?: number };
  };
}
