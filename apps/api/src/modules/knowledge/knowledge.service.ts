import { Injectable, NotFoundException } from "@nestjs/common";
import { KnowledgeItemDTO, PaginatedResult } from "@kenora/types";
import { QueryKnowledgeInput } from "@kenora/api-contracts";
import { HybridSearchEngine } from "@kenora/search";
import { BayesianVerificationEngine, VerificationResult } from "@kenora/verification";
import { DefaultKnowledgePipelineProcessor } from "@kenora/knowledge";

@Injectable()
export class KnowledgeService {
  private searchEngine = new HybridSearchEngine();
  private verificationEngine = new BayesianVerificationEngine();
  private pipelineProcessor = new DefaultKnowledgePipelineProcessor();

  private items: KnowledgeItemDTO[] = [
    {
      id: "ki-1",
      tenantId: "tenant-default",
      sourceId: "src-1",
      title: "Kenora Architecture & Monorepo Foundation Standard",
      content:
        "Kenora Phase 0 establishes a source-agnostic professional intelligence infrastructure with NestJS, Next.js, and Drizzle ORM.",
      contentType: "advisory",
      url: "https://docs.kenora.ai/architecture/phase-0",
      confidenceScore: 100,
      verificationStatus: "verified",
      tags: ["architecture", "monorepo", "typescript"],
      metadata: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  constructor() {
    this.searchEngine.setItems(this.items);
  }

  async queryKnowledge(
    tenantId: string,
    query: QueryKnowledgeInput,
    mode: "lexical" | "semantic" | "hybrid" = "hybrid",
  ): Promise<PaginatedResult<KnowledgeItemDTO>> {
    // If specific filters (contentType, verificationStatus) are passed without complex search query
    if (query.contentType || query.verificationStatus) {
      const filtered = this.items.filter((item) => {
        if (item.tenantId !== tenantId) return false;
        if (query.contentType && item.contentType !== query.contentType)
          return false;
        if (
          query.verificationStatus &&
          item.verificationStatus !== query.verificationStatus
        )
          return false;
        if (
          query.query &&
          !item.title.toLowerCase().includes(query.query.toLowerCase())
        )
          return false;
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
        totalPages: Math.ceil(filtered.length / limit) || 1,
      };
    }

    // Execute Reciprocal Rank Fusion (RRF) Hybrid Search
    return this.searchEngine.search({
      tenantId,
      query: query.query || "",
      mode,
      page: query.page || 1,
      limit: query.limit || 20,
    });
  }

  async verifyItem(tenantId: string, itemId: string): Promise<VerificationResult> {
    const item = this.items.find(
      (i) => i.id === itemId && i.tenantId === tenantId,
    );
    if (!item) {
      throw new NotFoundException(
        `KNOWLEDGE_ITEM_NOT_FOUND: Item '${itemId}' not found in tenant context`,
      );
    }

    const verification = await this.verificationEngine.verifyItem(itemId, tenantId);

    // Update item verification state and confidence score
    item.verificationStatus = verification.status;
    item.confidenceScore = verification.confidenceScore;
    item.updatedAt = new Date().toISOString();

    return verification;
  }

  async addItem(item: KnowledgeItemDTO): Promise<KnowledgeItemDTO> {
    this.items.push(item);
    this.searchEngine.addItem(item);
    return item;
  }
}
