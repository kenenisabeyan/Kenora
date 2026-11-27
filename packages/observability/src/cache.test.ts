import { describe, it, expect, vi } from "vitest";
import { LRUCache } from "./cache";

describe("LRUCache (High-Throughput Performance Accelerator)", () => {
  it("should store and retrieve values within TTL", () => {
    const cache = new LRUCache<string, { title: string }>({ capacity: 10, defaultTtlMs: 5000 });
    cache.set("item-1", { title: "Next.js App Router" });

    const retrieved = cache.get("item-1");
    expect(retrieved).toBeDefined();
    expect(retrieved?.title).toBe("Next.js App Router");
    expect(cache.getStats().hits).toBe(1);
  });

  it("should evict least recently used items when capacity is reached", () => {
    const cache = new LRUCache<string, number>({ capacity: 3, defaultTtlMs: 10000 });
    cache.set("a", 1);
    cache.set("b", 2);
    cache.set("c", 3);

    // Access 'a' to make it recently used (order now: b, c, a)
    cache.get("a");

    // Add 'd' -> 'b' should be evicted
    cache.set("d", 4);

    expect(cache.get("b")).toBeUndefined();
    expect(cache.get("a")).toBe(1);
    expect(cache.get("c")).toBe(3);
    expect(cache.get("d")).toBe(4);
    expect(cache.getStats().size).toBe(3);
  });

  it("should respect TTL expiration", async () => {
    const cache = new LRUCache<string, string>({ capacity: 5, defaultTtlMs: 20 });
    cache.set("temp", "fast-decay");

    expect(cache.get("temp")).toBe("fast-decay");

    await new Promise((resolve) => setTimeout(resolve, 30));

    expect(cache.get("temp")).toBeUndefined();
    expect(cache.getStats().misses).toBe(1);
  });
});
