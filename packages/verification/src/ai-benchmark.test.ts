import { describe, it, expect } from "vitest";
import { AIBenchmarkReproductionVerifier } from "./ai-benchmark";

describe("AI Ecosystem Intelligence: Benchmark Reproduction Protocol", () => {
  const verifier = new AIBenchmarkReproductionVerifier();

  it("should cap vendor-reported benchmark score at provisional confidence when unconfirmed", async () => {
    const record = await verifier.evaluateBenchmark(
      "bmk-001",
      "model-x-preview",
      "SWE-bench Verified",
      54.2,
      [], // No independent reproductions yet
    );

    expect(record.verificationStatus).toBe("provisional_vendor_reported");
    expect(record.confidenceScore).toBeLessThanOrEqual(70);
    expect(record.effectiveScore).toBe(54.2);
  });

  it("should upgrade benchmark score to verified with high confidence when >= 2 independent reproductions confirm", async () => {
    const record = await verifier.evaluateBenchmark(
      "bmk-002",
      "model-open-frontier",
      "HumanEval",
      88.5,
      [
        {
          auditorOrganization: "Stanford CRFM",
          reproducedScore: 88.2,
          variancePercentage: -0.3,
          hardwareConfig: "8x H100 SXM5",
          verificationDate: "2026-06-10T00:00:00.000Z",
          reproductionConfirmed: true,
        },
        {
          auditorOrganization: "Berkeley AI Research (BAIR)",
          reproducedScore: 88.6,
          variancePercentage: 0.1,
          hardwareConfig: "8x H100 PCIe",
          verificationDate: "2026-06-12T00:00:00.000Z",
          reproductionConfirmed: true,
        },
      ],
    );

    expect(record.verificationStatus).toBe("verified_by_reproduction");
    expect(record.confidenceScore).toBeGreaterThanOrEqual(90);
    expect(record.effectiveScore).toBeCloseTo(88.4, 1);
  });

  it("should flag benchmark score as disputed when independent reproductions fail to reproduce", async () => {
    const record = await verifier.evaluateBenchmark(
      "bmk-003",
      "model-hype-v1",
      "MMLU-Pro",
      82.0,
      [
        {
          auditorOrganization: "Independent Lab A",
          reproducedScore: 61.4,
          variancePercentage: -25.1,
          hardwareConfig: "Standard cluster",
          verificationDate: "2026-07-01T00:00:00.000Z",
          reproductionConfirmed: false,
          notes: "Data contamination suspected in vendor benchmark run.",
        },
      ],
    );

    expect(record.verificationStatus).toBe("disputed");
    expect(record.confidenceScore).toBeLessThanOrEqual(50);
  });
});
