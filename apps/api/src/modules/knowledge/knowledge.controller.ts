import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
  ApiQuery,
} from "@nestjs/swagger";
import { KnowledgeService } from "./knowledge.service.js";
import { KnowledgeItemDTO, PaginatedResult, APIResponse } from "@kenora/types";
import { QueryKnowledgeInput } from "@kenora/api-contracts";
import { Permissions } from "@kenora/security";
import {
  CurrentTenant,
  Public,
  SessionAuthGuard,
  PermissionsGuard,
  RequirePermission,
} from "../../common/index.js";
import { VerificationResult } from "@kenora/verification";

@ApiTags("Knowledge Explorer")
@ApiBearerAuth()
@UseGuards(SessionAuthGuard, PermissionsGuard)
@Controller("knowledge")
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "Explore verified knowledge items across ingested sources via Hybrid RRF Search",
  })
  @ApiHeader({
    name: "x-tenant-id",
    required: false,
    description: "Tenant Identifier (used if unauthenticated)",
  })
  @ApiQuery({
    name: "mode",
    required: false,
    enum: ["lexical", "semantic", "hybrid"],
    description: "Search retrieval mode",
  })
  async explore(
    @CurrentTenant() tenantId: string,
    @Query() query: QueryKnowledgeInput,
    @Query("mode") mode: "lexical" | "semantic" | "hybrid" = "hybrid",
  ): Promise<APIResponse<PaginatedResult<KnowledgeItemDTO>>> {
    const data = await this.knowledgeService.queryKnowledge(tenantId, query, mode);
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: "v1",
      },
    };
  }

  @Post(":id/verify")
  @RequirePermission(Permissions.KNOWLEDGE_UPDATE)
  @ApiOperation({
    summary: "Trigger on-demand Bayesian multi-source verification and confidence scoring",
  })
  async verifyItem(
    @CurrentTenant() tenantId: string,
    @Param("id") id: string,
  ): Promise<APIResponse<VerificationResult>> {
    const data = await this.knowledgeService.verifyItem(tenantId, id);
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: "v1",
      },
    };
  }
}
