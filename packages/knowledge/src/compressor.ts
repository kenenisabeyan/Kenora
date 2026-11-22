import { KnowledgeItemDTO } from "@kenora/types";

export interface CompressionOptions {
  maxItems?: number;
  minConfidence?: number;
  userDomainKeywords?: string[];
}

export interface CompressionResult {
  compressedItems: KnowledgeItemDTO[];
  originalCount: number;
  compressedCount: number;
  compressionRatio: string;
  discardedNoiseCount: number;
}

export interface IIntelligentKnowledgeCompressor {
  compress(
    items: KnowledgeItemDTO[],
    options?: CompressionOptions,
  ): Promise<CompressionResult>;
}

export class IntelligentKnowledgeCompressor implements IIntelligentKnowledgeCompressor {
  async compress(
    items: KnowledgeItemDTO[],
    options: CompressionOptions = {},
  ): Promise<CompressionResult> {
    const maxItems = options.maxItems ?? 12;
    const minConfidence = options.minConfidence ?? 60;
    const keywords = (options.userDomainKeywords || []).map((k) => k.toLowerCase());

    const originalCount = items.length;

    // Filter minimum confidence
    const candidateItems = items.filter((item) => item.confidenceScore >= minConfidence);

    // Calculate information density score
    const scoredItems = candidateItems.map((item) => {
      let relevanceScore = 50;
      if (keywords.length > 0) {
        const text = `${item.title} ${item.content} ${item.tags.join(" ")}`.toLowerCase();
        let matches = 0;
        for (const kw of keywords) {
          if (text.includes(kw)) matches++;
        }
        relevanceScore = Math.min(100, 50 + matches * 15);
      }

      // Information density combines confidence, recency, and relevance
      const densityScore = item.confidenceScore * 0.5 + relevanceScore * 0.5;

      return {
        item,
        densityScore,
      };
    });

    // Sort by information density descending
    scoredItems.sort((a, b) => b.densityScore - a.densityScore);

    // Deduplicate near-identical topics
    const seenTitles = new Set<string>();
    const selected: KnowledgeItemDTO[] = [];

    for (const scored of scoredItems) {
      const normalizedTitle = scored.item.title.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (seenTitles.has(normalizedTitle)) continue;
      seenTitles.add(normalizedTitle);
      selected.push(scored.item);
      if (selected.length >= maxItems) break;
    }

    const compressedCount = selected.length;
    const discardedNoiseCount = originalCount - compressedCount;
    const percentage = originalCount > 0
      ? ((discardedNoiseCount / originalCount) * 100).toFixed(1)
      : "0";

    return {
      compressedItems: selected,
      originalCount,
      compressedCount,
      compressionRatio: `${percentage}% noise eliminated (${originalCount} -> ${compressedCount})`,
      discardedNoiseCount,
    };
  }
}
