import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryLPKGStore } from "./lpkg";

describe("Living Professional Knowledge Graph (LPKG) Advanced Graph Algorithms", () => {
  let store: InMemoryLPKGStore;
  const tenantId = "tenant-engineering";

  beforeEach(() => {
    store = new InMemoryLPKGStore();
  });

  it("should create an entity and initialize its evolution timeline", async () => {
    const entity = await store.createEntity(tenantId, {
      name: "CommonJS",
      canonicalKey: "commonjs-spec",
      entityType: "standard",
      status: "active",
      validityInterval: { validFrom: "2010-01-01" },
      attributes: { loader: "require" },
      confidenceScore: 95,
    });

    expect(entity.id).toBeDefined();
    expect(entity.name).toBe("CommonJS");

    const timeline = await store.getEvolutionTimeline(tenantId, entity.id);
    expect(timeline.versions.length).toBe(1);
    expect(timeline.versions[0].version).toBe(1);
  });

  it("should trace supersession lineage across generations", async () => {
    const cjs = await store.createEntity(tenantId, {
      name: "CommonJS",
      canonicalKey: "commonjs",
      entityType: "standard",
      status: "active",
      validityInterval: { validFrom: "2010-01-01" },
      attributes: {},
      confidenceScore: 90,
    });

    const { updatedEntity: esm } = await store.supersedeEntity(
      tenantId,
      cjs.id,
      { name: "Native ESM", canonicalKey: "native-esm" },
      "Standardized across ECMAScript specifications",
    );

    const lineage = await store.getSupersessionLineage(tenantId, cjs.id);
    expect(lineage.length).toBe(2);
    expect(lineage[0].id).toBe(cjs.id);
    expect(lineage[1].id).toBe(esm.id);
  });

  it("should calculate blast radius (BFS) for impacted downstream entities", async () => {
    const root = await store.createEntity(tenantId, {
      name: "Node.js 18",
      canonicalKey: "node-18",
      entityType: "framework",
      status: "active",
      validityInterval: { validFrom: "2022-04-01" },
      attributes: {},
      confidenceScore: 95,
    });

    const serviceA = await store.createEntity(tenantId, {
      name: "Auth Service",
      canonicalKey: "auth-svc",
      entityType: "framework",
      status: "active",
      validityInterval: { validFrom: "2023-01-01" },
      attributes: {},
      confidenceScore: 92,
    });

    await store.createRelation(tenantId, {
      tenantId,
      sourceEntityId: serviceA.id,
      targetEntityId: root.id,
      relationType: "integrates_with",
      validityInterval: { validFrom: "2023-01-01" },
      status: "current",
      confidenceScore: 95,
      evidenceItemIds: [],
    });

    const blastRadius = await store.calculateBlastRadius(tenantId, root.id, 2);
    expect(blastRadius.totalAffectedEntities).toBe(1);
    expect(blastRadius.affectedEntities[0].entityName).toBe("Auth Service");
    expect(blastRadius.affectedEntities[0].depth).toBe(1);
  });

  it("should detect absence of circular supersession cycles in a healthy DAG", async () => {
    const e1 = await store.createEntity(tenantId, {
      name: "HTTP/1.1",
      canonicalKey: "http-1",
      entityType: "standard",
      status: "active",
      validityInterval: { validFrom: "1997-01-01" },
      attributes: {},
      confidenceScore: 99,
    });

    const { updatedEntity: e2 } = await store.supersedeEntity(
      tenantId,
      e1.id,
      { name: "HTTP/2" },
      "Multiplexed binary framing",
    );

    const { updatedEntity: e3 } = await store.supersedeEntity(
      tenantId,
      e2.id,
      { name: "HTTP/3" },
      "QUIC UDP transport eliminates head-of-line blocking",
    );

    const cycleCheck = await store.detectSupersessionCycles(tenantId);
    expect(cycleCheck.hasCycle).toBe(false);
  });
});
