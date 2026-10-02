import { Injectable } from '@nestjs/common';
import { KnowledgeItemDTO, PaginatedResult } from '@kenora/types';
import { QueryKnowledgeInput } from '@kenora/api-contracts';

@Injectable()
export class KnowledgeService {
  private items: KnowledgeItemDTO[] = [
    {
      id: 'ki-1',
      tenantId: 'tenant-default',
      sourceId: 'src-1',
      title: 'Kenora Architecture & Monorepo Foundation Standard',
      content: 'Kenora Phase 0 establishes a source-agnostic professional intelligence infrastructure with NestJS, Next.js, and Drizzle ORM.',
      contentType: 'advisory',
      url: 'https://docs.kenora.ai/architecture/phase-0',
      confidenceScore: 100,
      verificationStatus: 'verified',
      tags: ['architecture', 'monorepo', 'typescript'],
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  async queryKnowledge(tenantId: string, query: QueryKnowledgeInput): Promise<PaginatedResult<KnowledgeItemDTO>> {
    const filtered = this.items.filter((item) => {
      if (query.contentType && item.contentType !== query.contentType) return false;
      if (query.verificationStatus && item.verificationStatus !== query.verificationStatus) return false;
      if (query.query && !item.title.toLowerCase().includes(query.query.toLowerCase())) return false;
      return true;
    });

    const page = query.page || 1;
    const limit = query.limit || 20;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return {
      data: paginated,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
    };
  }
}
