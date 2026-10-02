import { Controller, Get, Query, Headers } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { KnowledgeService } from "./knowledge.service.js";
import { KnowledgeItemDTO, PaginatedResult, APIResponse } from "@kenora/types";
import { QueryKnowledgeInput } from "@kenora/api-contracts";

@ApiTags("Knowledge Explorer")
@Controller("knowledge")
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Get()
  @ApiOperation({
    summary: "Explore verified knowledge items across ingested sources",
  })
  async explore(
    @Headers("x-tenant-id") tenantId = "tenant-default",
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
