import { Controller, Get, Post, Body, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth, ApiHeader } from "@nestjs/swagger";
import { SourcesService } from "./sources.service.js";
import { SourceDTO, APIResponse } from "@kenora/types";
import { CreateSourceInput } from "@kenora/api-contracts";
import { CurrentTenant, Public, SessionAuthGuard } from "../../common/index.js";

@ApiTags("Sources")
@ApiBearerAuth()
@UseGuards(SessionAuthGuard)
@Controller("sources")
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "List all registered knowledge sources for tenant" })
  @ApiHeader({
    name: "x-tenant-id",
    required: false,
    description: "Tenant Identifier (used if unauthenticated)",
  })
  async listSources(
    @CurrentTenant() tenantId: string,
  ): Promise<APIResponse<SourceDTO[]>> {
    const data = await this.sourcesService.listSources(tenantId);
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: "v1",
      },
    };
  }

  @Public()
  @Post()
  @ApiOperation({ summary: "Register a new knowledge source" })
  @ApiHeader({
    name: "x-tenant-id",
    required: false,
    description: "Tenant Identifier (used if unauthenticated)",
  })
  async createSource(
    @CurrentTenant() tenantId: string,
    @Body() input: CreateSourceInput,
  ): Promise<APIResponse<SourceDTO>> {
    const data = await this.sourcesService.createSource(tenantId, input);
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
