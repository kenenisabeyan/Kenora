import { describe, it, expect } from "vitest";
import { SingleFlightGroup } from "./single-flight";

describe("SingleFlight Request Coalescing Engine (Thundering Herd Mitigation)", () => {
  it("should coalesce multiple concurrent identical calls into a single execution", async () => {
    const flight = new SingleFlightGroup();
    let executionCount = 0;

    const expensiveWork = async () => {
      executionCount++;
      await new Promise((resolve) => setTimeout(resolve, 50));
      return { result: "computed_expensive_payload" };
    };

    // Dispatch 10 concurrent requests for the exact same key
    const promises = Array.from({ length: 10 }, () =>
      flight.do("hot-lpkg-node-rsc", expensiveWork)
    );

    const results = await Promise.all(promises);

    // All 10 requests should receive the identical result
    expect(results.length).toBe(10);
    results.forEach((r) => expect(r.result).toBe("computed_expensive_payload"));

    // Crucial: The underlying function must only have been invoked ONCE!
    expect(executionCount).toBe(1);

    const stats = flight.getStats();
    expect(stats.totalCalls).toBe(10);
    expect(stats.coalescedCalls).toBe(9);
    expect(stats.activeInFlight).toBe(0);
  });

  it("should execute sequentially after previous in-flight promise resolves", async () => {
    const flight = new SingleFlightGroup();
    let executionCount = 0;

    const work = async () => {
      executionCount++;
      return executionCount;
    };

    const res1 = await flight.do("key-seq", work);
    const res2 = await flight.do("key-seq", work);

    expect(res1).toBe(1);
    expect(res2).toBe(2);
    expect(executionCount).toBe(2);
  });
});
