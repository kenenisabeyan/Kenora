import { describe, it, expect } from "vitest";
import { CorrelationContext } from "./index.js";

describe("CorrelationContext (AsyncLocalStorage)", () => {
  it("should isolate request IDs across concurrent async execution chains", async () => {
    const task1 = new Promise<string | undefined>((resolve) => {
      CorrelationContext.run("req-alpha", async () => {
        await new Promise((r) => setTimeout(r, 20));
        resolve(CorrelationContext.getRequestId());
      });
    });

    const task2 = new Promise<string | undefined>((resolve) => {
      CorrelationContext.run("req-beta", async () => {
        await new Promise((r) => setTimeout(r, 10));
        resolve(CorrelationContext.getRequestId());
      });
    });

    const [id1, id2] = await Promise.all([task1, task2]);
    expect(id1).toBe("req-alpha");
    expect(id2).toBe("req-beta");
  });

  it("should return undefined outside execution context scope", () => {
    expect(CorrelationContext.getRequestId()).toBeUndefined();
  });
});
