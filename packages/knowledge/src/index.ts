export * from "./lpkg";
export * from "./compressor";

import { KnowledgeItemDTO } from "@kenora/types";
import crypto from "node:crypto";

/**
 * Knowledge Pipeline Interfaces (Ingestion -> Normalization -> Deduplication -> Extraction -> Verification -> Graph)
 */

export interface NormalizedItem {
  externalId: string;
  sourceType: string;
  title: string;
  body: string;
  url: string;
  author?: string;
  publishedAt?: string;
  metadata: Record<string, unknown>;
}

export interface ExtractedClaim {
  claimText: string;
  subject: string;
  predicate: string;
  object: string;
  confidence: number;
}

export interface ExtractedEntity {
  name: string;
  type: string;
  attributes: Record<string, unknown>;
}

export interface KnowledgePipelineProcessor {
  normalize(rawItem: unknown, adapterType: string): Promise<NormalizedItem>;
  deduplicate(
    item: NormalizedItem,
    tenantId: string,
  ): Promise<{ isDuplicate: boolean; existingId?: string }>;
  extractClaims(item: NormalizedItem): Promise<ExtractedClaim[]>;
  extractEntities(item: NormalizedItem): Promise<ExtractedEntity[]>;
}

export class DefaultKnowledgePipelineProcessor implements KnowledgePipelineProcessor {
  private contentHashes = new Map<string, string>(); // tenant:hash -> itemId

  async normalize(rawItem: any, adapterType: string): Promise<NormalizedItem> {
    const title = (rawItem.title || rawItem.name || "Untitled Intelligence Record").trim();
    const body = (rawItem.content || rawItem.body || rawItem.description || "").trim();
    const url = rawItem.url || `urn:${adapterType}:${crypto.randomUUID()}`;
    const externalId =
      rawItem.externalId ||
      rawItem.id ||
      crypto.createHash("sha256").update(url).digest("hex").slice(0, 16);

    return {
      externalId: String(externalId),
      sourceType: adapterType,
      title,
      body,
      url,
      author: rawItem.author,
      publishedAt: rawItem.publishedAt || new Date().toISOString(),
      metadata: rawItem.metadata || {},
    };
  }

  async deduplicate(
    item: NormalizedItem,
    tenantId: string,
  ): Promise<{ isDuplicate: boolean; existingId?: string }> {
    const hash = crypto
      .createHash("sha256")
      .update(`${item.title}:${item.body}`)
      .digest("hex");

    const key = `${tenantId}:${hash}`;
    const existing = this.contentHashes.get(key);

    if (existing) {
      return { isDuplicate: true, existingId: existing };
    }

    this.contentHashes.set(key, item.externalId);
    return { isDuplicate: false };
  }

  async extractClaims(item: NormalizedItem): Promise<ExtractedClaim[]> {
    const claims: ExtractedClaim[] = [];
    const sentences = item.body.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);

    for (const sentence of sentences) {
      if (sentence.length < 15) continue;
      const words = sentence.split(/\s+/);
      if (words.length >= 3) {
        claims.push({
          claimText: sentence,
          subject: words[0],
          predicate: words[1],
          object: words.slice(2).join(" "),
          confidence: 0.85,
        });
      }
    }

    return claims;
  }

  async extractEntities(item: NormalizedItem): Promise<ExtractedEntity[]> {
    const entities: ExtractedEntity[] = [];
    const text = `${item.title} ${item.body}`;

    // Common technology and domain entity extraction patterns
    const techRegex =
      /\b(PostgreSQL|Redis|NestJS|Next\.js|Docker|Kubernetes|TypeScript|Drizzle|NATS|BullMQ|pgvector|Python)\b/gi;
    const matches = new Set(text.match(techRegex) || []);

    for (const name of matches) {
      entities.push({
        name,
        type: "technology",
        attributes: { mentions: text.split(new RegExp(name, "gi")).length - 1 },
      });
    }

    return entities;
  }
}
