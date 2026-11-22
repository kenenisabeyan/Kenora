import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryLPKGStore } from "./lpkg";

describe("Living Professional Knowledge Graph (LPKG)", () => {
  let store: InMemoryLPKGStore;
  const tenantId = "ten_test_lpkg";

  beforeEach(() => {
    store = new InMemoryLPKGStore();
  });

  it("should create active entity with validity interval", async () => {
    const entity = await store.createEntity(tenantId, {
      tenantId,
      name: "React Server Components",
      entityType: "framework",
      status: "active",
      validityInterval: { validFrom: new Date().toISOString() },
      attributes: { paradigm: "SSR" },
      confidenceScore: 92,
    });

    expect(entity.id).toBeDefined();
    expect(entity.name).toBe("React Server Components");
    expect(entity.status).toBe("active");
  });

  it("should supersede entity non-destructively and maintain evolution timeline", async () => {
    const original = await store.createEntity(tenantId, {
      tenantId,
      name: "Node.js Module System",
      entityType: "standard",
      status: "active",
      validityInterval: { validFrom: "2020-01-01T00:00:00.000Z" },
      attributes: { defaultFormat: "CommonJS" },
      confidenceScore: 90,
    });

    const { previousEntity, updatedEntity } = await store.supersedeEntity(
      tenantId,
      original.id,
      {
        name: "Node.js Module System",
        attributes: { defaultFormat: "ESM" },
      },
      "ECMAScript modules became default standard in Node v22+",
    );

    expect(previousEntity.status).toBe("superseded");
    expect(previousEntity.validityInterval.validTo).toBeDefined();

    expect(updatedEntity.status).toBe("active");
    expect(updatedEntity.attributes.defaultFormat).toBe("ESM");

    const timeline = await store.getEvolutionTimeline(tenantId, original.id);
    expect(timeline.versions.length).toBe(2);
    expect(timeline.versions[1].supersedingReason).toContain("ECMAScript modules");
  });

  it("should retrieve historical graph snapshot using time-travel query", async () => {
    const historicalTime = "2021-06-01T00:00:00.000Z";
    const entity = await store.createEntity(tenantId, {
      tenantId,
      name: "Legacy Tool",
      entityType: "technology",
      status: "superseded",
      validityInterval: {
        validFrom: "2020-01-01T00:00:00.000Z",
        validTo: "2022-01-01T00:00:00.000Z",
      },
      attributes: {},
      confidenceScore: 80,
    });

    const snapshotIn2021 = await store.getSnapshot(tenantId, historicalTime);
    expect(snapshotIn2021.entities.some((e) => e.name === "Legacy Tool")).toBe(true);

    const snapshotIn2024 = await store.getSnapshot(tenantId, "2024-01-01T00:00:00.000Z");
    expect(snapshotIn2024.entities.some((e) => e.name === "Legacy Tool")).toBe(false);
  });
});
