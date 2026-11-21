import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiHeader } from "@nestjs/swagger";
import { KnowledgeService } from "./knowledge.service.js";
import { KnowledgeItemDTO, PaginatedResult, APIResponse } from "@kenora/types";
import { QueryKnowledgeInput } from "@kenora/api-contracts";
import { CurrentTenant, Public, SessionAuthGuard } from "../../common/index.js";

@ApiTags("Knowledge Explorer")
@ApiBearerAuth()
@UseGuards(SessionAuthGuard)
@Controller("knowledge")
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Public()
  @Get()
  @ApiOperation({
    summary: "Explore verified knowledge items across ingested sources",
  })
  @ApiHeader({
    name: "x-tenant-id",
    required: false,
    description: "Tenant Identifier (used if unauthenticated)",
  })
  async explore(
    @CurrentTenant() tenantId: string,
    @Query() query: QueryKnowledgeInput,
  ): Promise<APIResponse<PaginatedResult<KnowledgeItemDTO>>> {
    const data = await this.knowledgeService.queryKnowledge(tenantId, query);
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
