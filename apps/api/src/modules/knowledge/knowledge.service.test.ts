import { describe, it, expect, beforeEach } from "vitest";
import { KnowledgeService } from "./knowledge.service.js";

describe("KnowledgeService & Hybrid RRF Search + Bayesian Verification", () => {
  let knowledgeService: KnowledgeService;

  beforeEach(() => {
    knowledgeService = new KnowledgeService();
  });

  it("should perform Hybrid RRF search within tenant boundary", async () => {
    const result = await knowledgeService.queryKnowledge(
      "tenant-default",
      { query: "Architecture", page: 1, limit: 10 },
      "hybrid",
    );

    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].title).toContain("Kenora Architecture");
    expect(result.total).toBe(1);
  });

  it("should return empty result for a different tenant (IDOR isolation)", async () => {
    const result = await knowledgeService.queryKnowledge(
      "tenant-other",
      { query: "Architecture" },
      "hybrid",
    );

    expect(result.data.length).toBe(0);
    expect(result.total).toBe(0);
  });

  it("should trigger Bayesian on-demand verification and update confidence score", async () => {
    const verification = await knowledgeService.verifyItem(
      "tenant-default",
      "ki-1",
    );

    expect(verification.status).toBe("verified");
    expect(verification.confidenceScore).toBeGreaterThanOrEqual(80);
    expect(verification.corroboratingSources.length).toBeGreaterThan(0);
  });

  it("should throw NotFoundException when verifying non-existent item", async () => {
    await expect(
      knowledgeService.verifyItem("tenant-default", "ki-non-existent"),
    ).rejects.toThrow("KNOWLEDGE_ITEM_NOT_FOUND");
  });
});
