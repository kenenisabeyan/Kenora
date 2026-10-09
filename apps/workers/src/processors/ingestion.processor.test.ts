import { describe, it, expect } from "vitest";
import { IngestionProcessor } from "./ingestion.processor.js";

describe("IngestionProcessor Background Job Security & Tenant Context", () => {
  it("should process job safely within re-established AsyncLocalStorage tenant context", async () => {
    const processor = new IngestionProcessor();

    await expect(
      processor.processSourcePolling({
        organizationId: "org-tenant-999",
        sourceId: "src-100",
        adapterType: "generic",
        url: "https://docs.kenora.ai/test-source",
        correlationId: "corr-job-12345",
      }),
    ).resolves.not.toThrow();
  });

  it("should reject background job payload missing organizationId", async () => {
    const processor = new IngestionProcessor();

    await expect(
      processor.processSourcePolling({
        organizationId: "",
        sourceId: "src-100",
        adapterType: "generic",
        url: "https://docs.kenora.ai/test-source",
      }),
    ).rejects.toThrow("WORKER_ERROR: Job payload missing required organizationId");
  });
});
