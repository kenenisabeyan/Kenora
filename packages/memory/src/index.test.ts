import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryMemoryStore } from "./index";

describe("Agent & Multi-Tenant Memory Store", () => {
  let memoryStore: InMemoryMemoryStore;
  const tenantA = "ten_alpha";
  const tenantB = "ten_beta";

  beforeEach(() => {
    memoryStore = new InMemoryMemoryStore();
  });

  it("should set and retrieve memory records scoped to tenant", async () => {
    await memoryStore.set({
      tenantId: tenantA,
      key: "preferred_runtime",
      value: "Node.js v24 ESM",
      type: "long_term",
    });

    const recordA = await memoryStore.get(tenantA, "preferred_runtime");
    expect(recordA?.value).toBe("Node.js v24 ESM");

    // Tenant B must not see Tenant A's record
    const recordB = await memoryStore.get(tenantB, "preferred_runtime");
    expect(recordB).toBeNull();
  });

  it("should enforce TTL expiration", async () => {
    await memoryStore.set({
      tenantId: tenantA,
      key: "temporary_session_cache",
      value: "temp_value",
      type: "short_term",
      ttlSeconds: 1, // 1 second
    });

    // Record immediately available
    const recordBefore = await memoryStore.get(tenantA, "temporary_session_cache");
    expect(recordBefore).not.toBeNull();

    // Fast-forward or wait 1100ms
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const recordAfter = await memoryStore.get(tenantA, "temporary_session_cache");
    expect(recordAfter).toBeNull();
  });

  it("should list episodic memories by agent ID", async () => {
    await memoryStore.set({
      tenantId: tenantA,
      agentId: "agent-del-nine-questions",
      key: "decision_cache_001",
      value: { decision: "recommend_patch" },
      type: "episodic",
    });

    await memoryStore.set({
      tenantId: tenantA,
      agentId: "agent-ver-benchmark",
      key: "benchmark_memo",
      value: { score: 95 },
      type: "episodic",
    });

    const agentRecords = await memoryStore.listByAgent(tenantA, "agent-del-nine-questions");
    expect(agentRecords.length).toBe(1);
    expect(agentRecords[0].key).toBe("decision_cache_001");
  });
});
