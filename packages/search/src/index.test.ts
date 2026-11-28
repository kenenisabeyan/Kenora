import { describe, it, expect } from "vitest";
import { HybridSearchEngine } from "./index";
import { KnowledgeItemDTO } from "@kenora/types";

describe("HybridSearchEngine (Reciprocal Rank Fusion k=60)", () => {
  const tenantA = "tenant-engineering";
  const tenantB = "tenant-marketing";

  const mockItems: KnowledgeItemDTO[] = [
    {
      id: "item-1",
      tenantId: tenantA,
      title: "React Server Components Architecture",
      content: "RSC moves component rendering to the edge and reduces client JavaScript bundle sizes.",
      url: "https://react.dev/blog/rsc",
      sourceId: "src-react",
      sourceType: "github_release",
      confidenceScore: 95,
      isVerified: true,
      metadata: {},
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "item-2",
      tenantId: tenantA,
      title: "Node.js Native ESM Module Resolution",
      content: "Node 22 stabilizes require(esm) and enables the native V8 compile cache by default.",
      url: "https://nodejs.org/en/blog/release/v22",
      sourceId: "src-node",
      sourceType: "github_release",
      confidenceScore: 92,
      isVerified: true,
      metadata: {},
      createdAt: "2026-01-02T00:00:00Z",
      updatedAt: "2026-01-02T00:00:00Z",
    },
    {
      id: "item-3",
      tenantId: tenantA,
      title: "RFC 9114: HTTP/3 over QUIC Transport",
      content: "HTTP/3 replaces TCP head-of-line blocking with UDP multiplexed streams.",
      url: "https://datatracker.ietf.org/doc/rfc9114/",
      sourceId: "src-ietf",
      sourceType: "spec",
      confidenceScore: 99,
      isVerified: true,
      metadata: {},
      createdAt: "2026-01-03T00:00:00Z",
      updatedAt: "2026-01-03T00:00:00Z",
    },
    {
      id: "item-isolated",
      tenantId: tenantB,
      title: "Marketing Campaign Q3 Launch Plan",
      content: "Confidential marketing initiatives and product positioning strategy.",
      url: "https://internal.acme.corp/marketing",
      sourceId: "src-marketing",
      sourceType: "internal",
      confidenceScore: 80,
      isVerified: true,
      metadata: {},
      createdAt: "2026-01-04T00:00:00Z",
      updatedAt: "2026-01-04T00:00:00Z",
    },
  ];

  it("should enforce strict tenant boundary isolation", async () => {
    const engine = new HybridSearchEngine(mockItems);
    const result = await engine.search({
      tenantId: tenantA,
      query: "marketing campaign",
      mode: "hybrid",
    });

    // Should return zero items from tenantB even when query matches tenantB content exactly
    expect(result.data.find((item) => item.tenantId === tenantB)).toBeUndefined();
  });

  it("should rank exact keyword matches highly in lexical mode", async () => {
    const engine = new HybridSearchEngine(mockItems);
    const result = await engine.search({
      tenantId: tenantA,
      query: "HTTP/3",
      mode: "lexical",
    });

    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data[0].id).toBe("item-3");
    expect(result.data[0].title).toContain("HTTP/3");
  });

  it("should fuse dense and sparse ranks via RRF k=60 in hybrid mode", async () => {
    const engine = new HybridSearchEngine(mockItems);
    const result = await engine.search({
      tenantId: tenantA,
      query: "rendering edge",
      mode: "hybrid",
    });

    expect(result.data.length).toBe(3);
    // item-1 has both high semantic confidence (95) and matches query keywords ("rendering", "edge")
    expect(result.data[0].id).toBe("item-1");
  });

  it("should support pagination correctly", async () => {
    const engine = new HybridSearchEngine(mockItems);
    const page1 = await engine.search({
      tenantId: tenantA,
      query: "",
      mode: "hybrid",
      limit: 2,
      page: 1,
    });

    expect(page1.data).toHaveLength(2);
    expect(page1.total).toBe(3);
    expect(page1.totalPages).toBe(2);
    expect(page1.page).toBe(1);

    const page2 = await engine.search({
      tenantId: tenantA,
      query: "",
      mode: "hybrid",
      limit: 2,
      page: 2,
    });

    expect(page2.data).toHaveLength(1);
    expect(page2.page).toBe(2);
  });
});
