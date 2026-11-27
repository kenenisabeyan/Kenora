import { describe, it, expect } from "vitest";
import { DynamicTrustScorer } from "./dts";
import { AuthorityTier } from "@kenora/types";

describe("Dynamic Trust Scoring (DTS) Engine", () => {
  it("should initialize with default authoritative source baselines", () => {
    const dts = new DynamicTrustScorer();
    const rfc = dts.getSourceReputation("ietf-rfc");
    expect(rfc).not.toBeNull();
    expect(rfc?.authorityTier).toBe(AuthorityTier.TIER_1_OFFICIAL_STANDARD);
    expect(rfc?.currentTrustScore).toBe(99);
  });

  it("should decay trust over time according to exponential half-life", () => {
    const dts = new DynamicTrustScorer();
    const source = dts.registerSource("test-vendor", "Test Vendor", AuthorityTier.TIER_2_VENDOR_DOCUMENTATION, 90);

    // 90 days in the future (1 half-life)
    const futureDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    const decayedTrust = dts.calculateDecayedTrust(source, futureDate);

    // Baseline 90 decayed by 50% = 45; blended with 100% empirical (10 verified / 10 total = 100):
    // 0.7 * 100 + 0.3 * 45 = 70 + 13.5 = 83.5
    expect(decayedTrust).toBeLessThan(90);
    expect(decayedTrust).toBeGreaterThan(80);
  });

  it("should penalize source trust score when claims are refuted", () => {
    const dts = new DynamicTrustScorer();
    const initial = dts.getSourceReputation("community-forum")!;
    const initialScore = initial.currentTrustScore;

    // Record multiple refuted outcomes
    dts.recordVerificationOutcome("community-forum", "refuted");
    dts.recordVerificationOutcome("community-forum", "refuted");
    dts.recordVerificationOutcome("community-forum", "refuted");

    const updated = dts.getSourceReputation("community-forum")!;
    expect(updated.refutedClaimsCount).toBe(3);
    expect(updated.currentTrustScore).toBeLessThan(initialScore);
  });
});
