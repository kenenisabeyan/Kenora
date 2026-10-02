import { Injectable } from '@nestjs/common';
import { SourceDTO } from '@kenora/types';
import { CreateSourceInput } from '@kenora/api-contracts';

@Injectable()
export class SourcesService {
  private sources: SourceDTO[] = [
    {
      id: 'src-1',
      tenantId: 'tenant-default',
      name: 'Kenora Architecture Advisories',
      adapterType: 'generic',
      url: 'https://docs.kenora.ai/advisories',
      status: 'active',
      pollingIntervalSeconds: 3600,
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  async listSources(tenantId: string): Promise<SourceDTO[]> {
    return this.sources.filter((s) => s.tenantId === tenantId || tenantId === 'tenant-default');
  }

  async createSource(tenantId: string, input: CreateSourceInput): Promise<SourceDTO> {
    const newSource: SourceDTO = {
      id: `src-${Date.now()}`,
      tenantId,
      name: input.name,
      adapterType: input.adapterType,
      url: input.url,
      status: 'active',
      pollingIntervalSeconds: input.pollingIntervalSeconds || 3600,
      metadata: input.metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.sources.push(newSource);
    return newSource;
  }
}
