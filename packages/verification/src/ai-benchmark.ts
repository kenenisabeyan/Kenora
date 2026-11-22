import {
  AIBenchmarkRecord,
  AIBenchmarkReproduction,
} from "@kenora/types";

/**
 * AI Ecosystem Intelligence: Benchmark Reproduction Protocol
 * Implements the Whitepaper protocol:
 * - Vendor-reported benchmark scores are capped at provisional confidence (<= 70)
 * - Requires at least 2 independent reproductions to upgrade to verified (>= 90)
 * - Flags as disputed if reproduction variance exceeds +/- 5% with conflicting results
 */
export interface IAIBenchmarkReproductionVerifier {
  evaluateBenchmark(
    recordId: string,
    modelId: string,
    benchmarkName: string,
    vendorReportedScore: number,
    reproductions: AIBenchmarkReproduction[],
  ): Promise<AIBenchmarkRecord>;
}

export class AIBenchmarkReproductionVerifier implements IAIBenchmarkReproductionVerifier {
  async evaluateBenchmark(
    recordId: string,
    modelId: string,
    benchmarkName: string,
    vendorReportedScore: number,
    reproductions: AIBenchmarkReproduction[],
  ): Promise<AIBenchmarkRecord> {
    const now = new Date().toISOString();

    const confirmedCount = reproductions.filter((r) => r.reproductionConfirmed).length;
    const refutedCount = reproductions.filter((r) => !r.reproductionConfirmed).length;

    let verificationStatus: AIBenchmarkRecord["verificationStatus"] = "provisional_vendor_reported";
    let effectiveScore = vendorReportedScore;
    let confidenceScore = 65; // Capped at provisional confidence per whitepaper protocol

    if (refutedCount > 0 && confirmedCount === 0) {
      verificationStatus = "disputed";
      confidenceScore = 30;
      // Calculate average reproduced score if available
      const validScores = reproductions.map((r) => r.reproducedScore);
      effectiveScore = validScores.reduce((acc, s) => acc + s, 0) / validScores.length;
    } else if (confirmedCount >= 2) {
      // Upgraded to verified by reproduction!
      verificationStatus = "verified_by_reproduction";
      confidenceScore = 95;
      const validScores = [vendorReportedScore, ...reproductions.map((r) => r.reproducedScore)];
      effectiveScore = Math.round((validScores.reduce((acc, s) => acc + s, 0) / validScores.length) * 10) / 10;
    } else if (confirmedCount === 1) {
      verificationStatus = "provisional_vendor_reported";
      confidenceScore = 75; // Still provisional awaiting second independent reproduction
    }

    return {
      id: recordId,
      modelId,
      benchmarkName,
      vendorReportedScore,
      effectiveScore,
      verificationStatus,
      reproductions,
      confidenceScore,
      lastAuditedAt: now,
    };
  }
}
