/**
 * Shared Type Definitions for Kenora Monorepo
 * Aligned with Kenora Architecture & Vision Whitepaper v3.0
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

export interface UserDTO {
  id: string;
  email: string;
  name: string;
  isEmailVerified: boolean;
  status: "active" | "suspended";
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationDTO {
  id: string;
  name: string;
  slug: string;
  status: "active" | "suspended";
  createdAt: string;
  updatedAt: string;
}

export interface MembershipDTO {
  id: string;
  userId: string;
  organizationId: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  status: "active" | "invited";
  createdAt: string;
  updatedAt: string;
}

export interface AuthSessionDTO {
  sessionId: string;
  user: UserDTO;
  activeOrganization?: OrganizationDTO;
  memberships: MembershipDTO[];
  expiresAt: string;
}

export interface KnowledgeItemDTO {
  id: string;
  tenantId: string;
  sourceId: string;
  externalId?: string;
  title: string;
  content: string;
  contentType:
    | "article"
    | "paper"
    | "code"
    | "video"
    | "discussion"
    | "advisory";
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

/**
 * Living Professional Knowledge Graph (LPKG) Types
 * Temporal Entity-Relation & Evidence Network
 */

export interface ValidityInterval {
  validFrom: string;
  validTo?: string;
}

export interface LPKGEntity {
  id: string;
  tenantId: string;
  name: string;
  canonicalKey?: string;
  entityType: "technology" | "framework" | "pattern" | "organization" | "concept" | "standard";
  validityInterval: ValidityInterval;
  status: "active" | "superseded" | "deprecated";
  attributes: Record<string, unknown>;
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface LPKGRelation {
  id: string;
  tenantId: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationType: "implements" | "supersedes" | "deprecates" | "integrates_with" | "conflicts_with" | "derived_from";
  validityInterval: ValidityInterval;
  status: "current" | "superseded";
  confidenceScore: number;
  evidenceItemIds: string[];
  createdAt: string;
}

export interface LPKGGraphSnapshot {
  entities: LPKGEntity[];
  relations: LPKGRelation[];
  asOfTimestamp: string;
}

export interface KnowledgeEvolutionTimelineVersion {
  version: number;
  timestamp: string;
  data: Record<string, unknown>;
  supersededBy?: string;
  supersedingReason?: string;
}

export interface KnowledgeEvolutionTimeline {
  entityId: string;
  tenantId: string;
  versions: KnowledgeEvolutionTimelineVersion[];
}

/**
 * Multi-Source Verification Framework (MSVF)
 * 3-Step Conflict Resolution Policy
 */

export enum AuthorityTier {
  TIER_1_OFFICIAL = 1,     // Official specs, standards, RFCs, primary repo code & official docs
  TIER_2_MAINTAINERS = 2,  // Core maintainers, peer-reviewed benchmarks, major foundation advisories
  TIER_3_INDUSTRY = 3,     // Vetted industry engineering blogs, verified technical media
  TIER_4_COMMUNITY = 4,    // Community forums, social platforms, unverified individual posts
}

export interface ClaimVerificationEvidence {
  sourceId: string;
  sourceName: string;
  authorityTier: AuthorityTier;
  publishedAt: string;
  claimExcerpt: string;
  stance: "supports" | "refutes";
  evidenceConfidence: number;
}

export interface MSVFConflictResolutionResult {
  claimId: string;
  resolutionStep: "step_1_authority_tier" | "step_2_recency" | "step_3_unresolved_conflict";
  winnerClaim?: string;
  winningTier?: AuthorityTier;
  winningDate?: string;
  isUnresolvedConflict: boolean;
  conflictingStances: {
    stanceA: { claimText: string; sources: ClaimVerificationEvidence[] };
    stanceB: { claimText: string; sources: ClaimVerificationEvidence[] };
  };
  explanation: string;
  confidenceScore: number;
  adjudicatedAt: string;
}

/**
 * AI Ecosystem Intelligence & Benchmark Reproduction Protocol
 */

export interface AIFoundationModelProfile {
  id: string;
  name: string;
  developer: string;
  architecture: string;
  parameterCountBillions?: number;
  contextWindowTokens: number;
  license: "open-source" | "open-weights" | "proprietary" | "research-only";
  releaseDate: string;
  status: "active" | "preview" | "deprecated";
}

export interface AIBenchmarkReproduction {
  auditorOrganization: string;
  reproducedScore: number;
  variancePercentage: number;
  hardwareConfig: string;
  verificationDate: string;
  reproductionConfirmed: boolean;
  notes?: string;
}

export interface AIBenchmarkRecord {
  id: string;
  modelId: string;
  benchmarkName: string; // e.g. "MMLU-Pro", "SWE-bench Verified", "HumanEval"
  vendorReportedScore: number;
  effectiveScore: number;
  verificationStatus: "provisional_vendor_reported" | "verified_by_reproduction" | "disputed";
  reproductions: AIBenchmarkReproduction[];
  confidenceScore: number; // Capped at 70 if provisional, >= 90 if >= 2 independent reproductions confirm
  lastAuditedAt: string;
}

/**
 * 28-Agent Cluster Architecture
 */

export type AgentClusterType =
  | "acquisition"
  | "understanding"
  | "verification"
  | "delivery"
  | "governance";

export interface KenoraAgentSpec {
  id: string;
  name: string;
  cluster: AgentClusterType;
  description: string;
  capabilities: string[];
}

export interface ClusterStatus {
  cluster: AgentClusterType;
  totalAgents: number;
  activeAgents: number;
  healthy: boolean;
  agents: KenoraAgentSpec[];
}

/**
 * Daily Professional Intelligence: 9-Question Response Pipeline
 */

export interface DailyIntelligenceNineQuestions {
  whatChanged: string;
  whyItMatters: string;
  whoIsAffected: string[];
  confidenceAndEvidence: {
    confidenceScore: number;
    evidenceUrls: string[];
    authorityTiers: AuthorityTier[];
  };
  recommendedAction: string;
  whatToLearn: string;
  whatToIgnore: string;
  emergingTrends: string[];
  forecast: string;
}

export interface DailyProfessionalIntelligenceReport {
  id: string;
  tenantId: string;
  userId: string;
  date: string;
  headline: string;
  highImpactItemsCount: number;
  distillationRatio: string; // e.g., "Compressed from 14,200 raw events to 12 verified insights"
  nineQuestions: DailyIntelligenceNineQuestions;
  keyInsights: KnowledgeItemDTO[];
  generatedAt: string;
}
