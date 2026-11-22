import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { IntelligenceService } from "./intelligence.service.js";
import { KnowledgeService } from "../knowledge/knowledge.service.js";
import { SessionAuthGuard } from "../../common/guards/session-auth.guard.js";
import { PermissionsGuard } from "../../common/guards/permissions.guard.js";
import { RateLimitGuard } from "../../common/guards/rate-limit.guard.js";
import { CurrentTenant } from "../../common/decorators/current-tenant.decorator.js";
import { CurrentUser } from "../../common/decorators/current-user.decorator.js";
import { RequirePermission } from "../../common/decorators/permissions.decorator.js";
import { Permissions } from "@kenora/security";
import {
  DailyProfessionalIntelligenceReport,
  LPKGEntity,
  LPKGRelation,
  LPKGGraphSnapshot,
  KnowledgeEvolutionTimeline,
  AIBenchmarkRecord,
  AIBenchmarkReproduction,
  ClusterStatus,
  UserDTO,
} from "@kenora/types";

export class CreateEntityDto {
  name!: string;
  entityType!: "technology" | "framework" | "pattern" | "organization" | "concept" | "standard";
  status!: "active" | "superseded" | "deprecated";
  validityInterval!: { validFrom: string; validTo?: string };
  attributes!: Record<string, unknown>;
  confidenceScore!: number;
}

export class SupersedeEntityDto {
  updatedData!: Partial<LPKGEntity>;
  reason!: string;
}

export class CreateRelationDto {
  sourceEntityId!: string;
  targetEntityId!: string;
  relationType!: "implements" | "supersedes" | "deprecates" | "integrates_with" | "conflicts_with" | "derived_from";
  validityInterval!: { validFrom: string; validTo?: string };
  status!: "current" | "superseded";
  confidenceScore!: number;
  evidenceItemIds!: string[];
}

export class AdjudicateConflictDto {
  claimId!: string;
  stanceA!: { claimText: string; evidence: any[] };
  stanceB!: { claimText: string; evidence: any[] };
}

export class VerifyBenchmarkDto {
  recordId!: string;
  modelId!: string;
  benchmarkName!: string;
  vendorReportedScore!: number;
  reproductions!: AIBenchmarkReproduction[];
}

@ApiTags("intelligence")
@ApiBearerAuth()
@UseGuards(SessionAuthGuard, PermissionsGuard, RateLimitGuard)
@Controller("intelligence")
export class IntelligenceController {
  constructor(
    private readonly intelligenceService: IntelligenceService,
    private readonly knowledgeService: KnowledgeService,
  ) {}

  @Get("briefings/daily")
  @RequirePermission(Permissions.KNOWLEDGE_READ)
  @ApiOperation({
    summary: "Get Daily Professional Intelligence (9-Question Response Pipeline)",
    description: "Synthesizes today's 9-question executive intelligence decision report.",
  })
  @ApiResponse({ status: 200, description: "Daily intelligence report successfully generated" })
  async getDailyBriefing(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: UserDTO,
  ): Promise<DailyProfessionalIntelligenceReport> {
    const candidateKnowledge = await this.knowledgeService.listItems(tenantId, 1, 50);
    return this.intelligenceService.getOrGenerateDailyReport(
      tenantId,
      user.id,
      candidateKnowledge.data,
    );
  }

  @Post("briefings/daily/generate")
  @HttpCode(HttpStatus.OK)
  @RequirePermission(Permissions.KNOWLEDGE_READ)
  @ApiOperation({
    summary: "Force generate Daily Professional Intelligence report",
    description: "Forces a fresh synthesis of the 9-Question decision pipeline for today.",
  })
  async generateDailyBriefing(
    @CurrentTenant() tenantId: string,
    @CurrentUser() user: UserDTO,
  ): Promise<DailyProfessionalIntelligenceReport> {
    const candidateKnowledge = await this.knowledgeService.listItems(tenantId, 1, 50);
    return this.intelligenceService.getOrGenerateDailyReport(
      tenantId,
      user.id,
      candidateKnowledge.data,
    );
  }

  @Post("graph/entity")
  @RequirePermission(Permissions.KNOWLEDGE_CREATE)
  @ApiOperation({ summary: "Create entity in Living Professional Knowledge Graph (LPKG)" })
  async createGraphEntity(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateEntityDto,
  ): Promise<LPKGEntity> {
    return this.intelligenceService.createGraphEntity(tenantId, {
      ...dto,
      tenantId,
    });
  }

  @Post("graph/entity/:id/supersede")
  @RequirePermission(Permissions.KNOWLEDGE_UPDATE)
  @ApiOperation({
    summary: "Supersede LPKG entity non-destructively",
    description: "Archives old entity state into evolution timeline and creates new active entity version.",
  })
  async supersedeGraphEntity(
    @CurrentTenant() tenantId: string,
    @Param("id") id: string,
    @Body() dto: SupersedeEntityDto,
  ): Promise<{ previousEntity: LPKGEntity; updatedEntity: LPKGEntity }> {
    return this.intelligenceService.supersedeGraphEntity(
      tenantId,
      id,
      dto.updatedData,
      dto.reason,
    );
  }

  @Post("graph/relation")
  @RequirePermission(Permissions.KNOWLEDGE_CREATE)
  @ApiOperation({ summary: "Create relation in LPKG" })
  async createGraphRelation(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateRelationDto,
  ): Promise<LPKGRelation> {
    return this.intelligenceService.createGraphRelation(tenantId, {
      ...dto,
      tenantId,
    });
  }

  @Get("graph/snapshot")
  @RequirePermission(Permissions.KNOWLEDGE_READ)
  @ApiOperation({
    summary: "Time-travel query across Living Professional Knowledge Graph",
    description: "Returns graph snapshot as of given timestamp or present time.",
  })
  async getGraphSnapshot(
    @CurrentTenant() tenantId: string,
    @Query("asOf") asOfTimestamp?: string,
  ): Promise<LPKGGraphSnapshot> {
    return this.intelligenceService.queryGraphSnapshot(tenantId, asOfTimestamp);
  }

  @Get("graph/entity/:id/timeline")
  @RequirePermission(Permissions.KNOWLEDGE_READ)
  @ApiOperation({ summary: "Get entity evolution timeline (superseded versions and reasons)" })
  async getEntityEvolutionTimeline(
    @CurrentTenant() tenantId: string,
    @Param("id") id: string,
  ): Promise<KnowledgeEvolutionTimeline> {
    return this.intelligenceService.getEntityEvolutionTimeline(tenantId, id);
  }

  @Post("conflicts/adjudicate")
  @HttpCode(HttpStatus.OK)
  @RequirePermission(Permissions.KNOWLEDGE_READ)
  @ApiOperation({
    summary: "Adjudicate conflicting claims via MSVF 3-Step Precedence Policy",
    description: "Applies Step 1 (Authority Tier), Step 2 (Recency), Step 3 (Explicit Unresolved Conflict).",
  })
  async adjudicateConflict(@Body() dto: AdjudicateConflictDto) {
    return this.intelligenceService.adjudicateConflict(
      dto.claimId,
      dto.stanceA,
      dto.stanceB,
    );
  }

  @Post("ai-benchmarks/verify")
  @HttpCode(HttpStatus.OK)
  @RequirePermission(Permissions.KNOWLEDGE_CREATE)
  @ApiOperation({
    summary: "Verify AI Benchmark via Benchmark Reproduction Protocol",
    description: "Caps vendor benchmarks at provisional confidence until confirmed by >= 2 independent reproductions.",
  })
  async verifyAIBenchmark(@Body() dto: VerifyBenchmarkDto): Promise<AIBenchmarkRecord> {
    return this.intelligenceService.verifyAIBenchmark(
      dto.recordId,
      dto.modelId,
      dto.benchmarkName,
      dto.vendorReportedScore,
      dto.reproductions,
    );
  }

  @Get("agents/status")
  @RequirePermission(Permissions.AGENT_READ)
  @ApiOperation({
    summary: "Get status of Kenora 28-Agent Cluster Architecture",
    description: "Reports telemetry and status across Acquisition, Understanding, Verification, Delivery, and Governance clusters.",
  })
  async getAgentsStatus(): Promise<ClusterStatus[]> {
    return this.intelligenceService.getAgentClustersStatus();
  }
}
