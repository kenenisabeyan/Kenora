import { KnowledgeItemDTO, PaginatedResult } from "@kenora/types";

export interface SearchQueryOptions {
  tenantId: string;
  query: string;
  mode?: "lexical" | "semantic" | "hybrid";
  embedding?: number[];
  limit?: number;
  page?: number;
}

export interface ISearchEngine {
  search(
    options: SearchQueryOptions,
  ): Promise<PaginatedResult<KnowledgeItemDTO>>;
}

export class HybridSearchEngine implements ISearchEngine {
  private items: KnowledgeItemDTO[] = [];

  constructor(initialItems: KnowledgeItemDTO[] = []) {
    this.items = [...initialItems];
  }

  setItems(items: KnowledgeItemDTO[]) {
    this.items = [...items];
  }

  addItem(item: KnowledgeItemDTO) {
    this.items.push(item);
  }

  async search(
    options: SearchQueryOptions,
  ): Promise<PaginatedResult<KnowledgeItemDTO>> {
    const tenantId = options.tenantId;
    const query = (options.query || "").toLowerCase().trim();
    const mode = options.mode || "hybrid";
    const page = options.page || 1;
    const limit = options.limit || 20;

    // Filter strictly by tenant boundary
    const tenantItems = this.items.filter((item) => item.tenantId === tenantId);

    let scoredItems: { item: KnowledgeItemDTO; score: number }[] = [];

    if (mode === "lexical") {
      scoredItems = tenantItems
        .map((item) => {
          let score = 0;
          if (query) {
            const inTitle = (item.title.toLowerCase().match(new RegExp(query, "g")) || []).length;
            const inContent = (item.content.toLowerCase().match(new RegExp(query, "g")) || []).length;
            score = inTitle * 3 + inContent;
          } else {
            score = 1;
          }
          return { item, score };
        })
        .filter((entry) => entry.score > 0)
        .sort((a, b) => b.score - a.score);
    } else if (mode === "semantic") {
      scoredItems = tenantItems
        .map((item) => {
          // Compute cosine similarity approximation or confidence weighting
          const score = item.confidenceScore / 100;
          return { item, score };
        })
        .sort((a, b) => b.score - a.score);
    } else {
      // Reciprocal Rank Fusion (RRF) between lexical and semantic rankings
      const lexicalRanked = tenantItems
        .map((item) => {
          const inTitle = (item.title.toLowerCase().match(new RegExp(query, "g")) || []).length;
          const inContent = (item.content.toLowerCase().match(new RegExp(query, "g")) || []).length;
          return { item, rawScore: inTitle * 3 + inContent };
        })
        .sort((a, b) => b.rawScore - a.rawScore);

      const semanticRanked = [...tenantItems].sort(
        (a, b) => b.confidenceScore - a.confidenceScore,
      );

      const rrfScores = new Map<string, { item: KnowledgeItemDTO; score: number }>();
      const k = 60; // Standard RRF constant

      lexicalRanked.forEach((entry, rank) => {
        const id = entry.item.id;
        const current = rrfScores.get(id) || { item: entry.item, score: 0 };
        current.score += 0.35 / (k + (rank + 1));
        rrfScores.set(id, current);
      });

      semanticRanked.forEach((item, rank) => {
        const id = item.id;
        const current = rrfScores.get(id) || { item, score: 0 };
        current.score += 0.65 / (k + (rank + 1));
        rrfScores.set(id, current);
      });

      scoredItems = Array.from(rrfScores.values()).sort(
        (a, b) => b.score - a.score,
      );
    }

    const total = scoredItems.length;
    const startIndex = (page - 1) * limit;
    const paginated = scoredItems
      .slice(startIndex, startIndex + limit)
      .map((entry) => entry.item);

    return {
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }
}
