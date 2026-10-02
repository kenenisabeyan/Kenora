import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiHeader } from '@nestjs/swagger';
import { SourcesService } from './sources.service.js';
import { SourceDTO, APIResponse } from '@kenora/types';
import { CreateSourceInput } from '@kenora/api-contracts';

@ApiTags('Sources')
@Controller('sources')
export class SourcesController {
  constructor(private readonly sourcesService: SourcesService) {}

  @Get()
  @ApiOperation({ summary: 'List all registered knowledge sources for tenant' })
  @ApiHeader({ name: 'x-tenant-id', required: false, description: 'Tenant Identifier' })
  async listSources(@Headers('x-tenant-id') tenantId = 'tenant-default'): Promise<APIResponse<SourceDTO[]>> {
    const data = await this.sourcesService.listSources(tenantId);
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1',
      },
    };
  }

  @Post()
  @ApiOperation({ summary: 'Register a new knowledge source' })
  async createSource(
    @Headers('x-tenant-id') tenantId = 'tenant-default',
    @Body() input: CreateSourceInput,
  ): Promise<APIResponse<SourceDTO>> {
    const data = await this.sourcesService.createSource(tenantId, input);
    return {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: 'v1',
      },
    };
  }
}
