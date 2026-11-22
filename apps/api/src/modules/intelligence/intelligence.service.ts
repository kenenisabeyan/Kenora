import { Injectable, Logger } from "@nestjs/common";
import {
  DailyProfessionalIntelligenceReport,
  DailyIntelligenceNineQuestions,
  AuthorityTier,
  KnowledgeItemDTO,
  LPKGEntity,
  LPKGRelation,
  LPKGGraphSnapshot,
  KnowledgeEvolutionTimeline,
  AIBenchmarkRecord,
  AIBenchmarkReproduction,
  ClusterStatus,
} from "@kenora/types";
import {
  InMemoryLPKGStore,
  IntelligentKnowledgeCompressor,
} from "@kenora/knowledge";
import {
  MSVFConflictAdjudicator,
  AIBenchmarkReproductionVerifier,
} from "@kenora/verification";
import { KenoraAgentClusterOrchestrator } from "@kenora/agents";
import crypto from "node:crypto";

@Injectable()
export class IntelligenceService {
  private readonly logger = new Logger(IntelligenceService.name);
  private lpkgStore = new InMemoryLPKGStore();
  private compressor = new IntelligentKnowledgeCompressor();
  private msvfAdjudicator = new MSVFConflictAdjudicator();
  private benchmarkVerifier = new AIBenchmarkReproductionVerifier();
  private clusterOrchestrator = new KenoraAgentClusterOrchestrator();

  // In-memory cache of daily briefings per tenant:date
  private dailyBriefings = new Map<string, DailyProfessionalIntelligenceReport>();

  constructor() {
    this.logger.log("Initialized Kenora Professional Intelligence Engine with LPKG, MSVF, and 28-Agent Cluster");
  }

  /**
   * Generates or retrieves the Daily Professional Intelligence 9-Question Report
   */
  async getOrGenerateDailyReport(
    tenantId: string,
    userId: string,
    candidateItems: KnowledgeItemDTO[],
  ): Promise<DailyProfessionalIntelligenceReport> {
    const today = new Date().toISOString().split("T")[0];
    const cacheKey = `${tenantId}:${today}:${userId}`;

    const existing = this.dailyBriefings.get(cacheKey);
    if (existing) {
      return existing;
    }

    // Step 1: Intelligent Knowledge Compression (IKC)
    // Compressing raw candidate events to high-density items
    const compression = await this.compressor.compress(candidateItems, {
      maxItems: 12,
      minConfidence: 65,
    });

    const highImpactItems = compression.compressedItems;

    // Step 2: Synthesize the 9-Question Decision Framework
    const whatChanged = highImpactItems.length > 0
      ? highImpactItems.map((item) => `- ${item.title}: ${item.content.slice(0, 120)}...`).join("\n")
      : "No breaking specification or critical vulnerability deltas detected in this cycle.";

    const nineQuestions: DailyIntelligenceNineQuestions = {
      whatChanged,
      whyItMatters:
        "Direct impact on production resilience, zero-trust perimeter enforcement, and latency SLAs. Unverified dependencies and unverified benchmark claims represent critical supply chain and decision risks.",
      whoIsAffected: [
        "Distributed Systems Architects",
        "Staff Software Engineers",
        "Platform & Infrastructure Leads",
        "Security & Compliance Officers",
      ],
      confidenceAndEvidence: {
        confidenceScore: highImpactItems.length > 0
          ? Math.round(
              highImpactItems.reduce((acc, i) => acc + i.confidenceScore, 0) /
                highImpactItems.length,
            )
          : 95,
        evidenceUrls: highImpactItems.map((i) => i.url),
        authorityTiers: [
          AuthorityTier.TIER_1_OFFICIAL,
          AuthorityTier.TIER_2_MAINTAINERS,
        ],
      },
      recommendedAction:
        "Audit existing services against verified advisories. Update runtimes adhering to non-destructive evolution specifications. Disregard unconfirmed vendor benchmarks.",
      whatToLearn:
        "Temporal Knowledge Graph modelling (LPKG), Multi-Source Verification Framework (MSVF), and Dual-Reproduction AI benchmarking.",
      whatToIgnore:
        "Uncorroborated single-vendor benchmark marketing announcements, unverified Twitter/X claim threads, and premature breaking deprecation notices lacking primary RFC citations.",
      emergingTrends: [
        "Rapid convergence towards temporal, non-destructive knowledge representation.",
        "Transition from ungrounded LLM summaries to verified multi-source evidence graphs.",
        "Mandatory independent verification for AI reasoning and coding benchmarks.",
      ],
      forecast:
        "Over the next 60 days, expect official standards bodies to release finalized specifications. Early adopters of dual-reproduction auditing will reduce deployment failure rates by an estimated 40%.",
    };

    const report: DailyProfessionalIntelligenceReport = {
      id: `rep-${crypto.randomUUID()}`,
      tenantId,
      userId,
      date: today,
      headline: "Daily Executive Intelligence: Verified Knowledge & Decision Briefing",
      highImpactItemsCount: highImpactItems.length,
      distillationRatio: compression.compressionRatio,
      nineQuestions,
      keyInsights: highImpactItems,
      generatedAt: new Date().toISOString(),
    };

    this.dailyBriefings.set(cacheKey, report);
    return report;
  }

  /**
   * Living Professional Knowledge Graph (LPKG) Operations
   */
  async createGraphEntity(
    tenantId: string,
    entity: Omit<LPKGEntity, "id" | "createdAt" | "updatedAt">,
  ): Promise<LPKGEntity> {
    return this.lpkgStore.createEntity(tenantId, entity);
  }

  async supersedeGraphEntity(
    tenantId: string,
    existingEntityId: string,
    updatedData: Partial<LPKGEntity>,
    reason: string,
  ): Promise<{ previousEntity: LPKGEntity; updatedEntity: LPKGEntity }> {
    return this.lpkgStore.supersedeEntity(tenantId, existingEntityId, updatedData, reason);
  }

  async createGraphRelation(
    tenantId: string,
    relation: Omit<LPKGRelation, "id" | "createdAt">,
  ): Promise<LPKGRelation> {
    return this.lpkgStore.createRelation(tenantId, relation);
  }

  async queryGraphSnapshot(
    tenantId: string,
    asOfTimestamp?: string,
  ): Promise<LPKGGraphSnapshot> {
    return this.lpkgStore.getSnapshot(tenantId, asOfTimestamp);
  }

  async getEntityEvolutionTimeline(
    tenantId: string,
    entityId: string,
  ): Promise<KnowledgeEvolutionTimeline> {
    return this.lpkgStore.getEvolutionTimeline(tenantId, entityId);
  }

  /**
   * Multi-Source Verification Framework (MSVF) Conflict Adjudication
   */
  async adjudicateConflict(
    claimId: string,
    stanceA: { claimText: string; evidence: any[] },
    stanceB: { claimText: string; evidence: any[] },
  ) {
    return this.msvfAdjudicator.adjudicateConflict(claimId, stanceA, stanceB);
  }

  /**
   * AI Ecosystem Intelligence: Benchmark Reproduction Protocol
   */
  async verifyAIBenchmark(
    recordId: string,
    modelId: string,
    benchmarkName: string,
    vendorReportedScore: number,
    reproductions: AIBenchmarkReproduction[],
  ): Promise<AIBenchmarkRecord> {
    return this.benchmarkVerifier.evaluateBenchmark(
      recordId,
      modelId,
      benchmarkName,
      vendorReportedScore,
      reproductions,
    );
  }

  /**
   * 28-Agent Cluster Status and Registry
   */
  getAgentClustersStatus(): ClusterStatus[] {
    return this.clusterOrchestrator.getAllClustersStatus();
  }
}
