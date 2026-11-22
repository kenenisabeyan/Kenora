import { describe, it, expect } from "vitest";
import { MSVFConflictAdjudicator } from "./msvf";
import { AuthorityTier, ClaimVerificationEvidence } from "@kenora/types";

describe("Multi-Source Verification Framework (MSVF) 3-Step Conflict Adjudication", () => {
  const adjudicator = new MSVFConflictAdjudicator();

  it("Step 1: resolves conflict using Authority Tier precedence", async () => {
    const stanceA: { claimText: string; evidence: ClaimVerificationEvidence[] } = {
      claimText: "HTTP/3 uses QUIC over UDP exclusively.",
      evidence: [
        {
          sourceId: "rfc-9114",
          sourceName: "IETF RFC 9114 Official Standard",
          authorityTier: AuthorityTier.TIER_1_OFFICIAL,
          publishedAt: "2022-06-01T00:00:00.000Z",
          claimExcerpt: "HTTP/3 relies on QUIC transport protocol over UDP.",
          stance: "supports",
          evidenceConfidence: 99,
        },
      ],
    };

    const stanceB: { claimText: string; evidence: ClaimVerificationEvidence[] } = {
      claimText: "HTTP/3 can optionally run on TCP.",
      evidence: [
        {
          sourceId: "forum-thread-41",
          sourceName: "Developer Forum Discussion",
          authorityTier: AuthorityTier.TIER_4_COMMUNITY,
          publishedAt: "2023-01-01T00:00:00.000Z",
          claimExcerpt: "Someone mentioned HTTP/3 works over TCP fallback.",
          stance: "supports",
          evidenceConfidence: 60,
        },
      ],
    };

    const result = await adjudicator.adjudicateConflict("claim-http3", stanceA, stanceB);

    expect(result.resolutionStep).toBe("step_1_authority_tier");
    expect(result.winnerClaim).toBe(stanceA.claimText);
    expect(result.winningTier).toBe(AuthorityTier.TIER_1_OFFICIAL);
    expect(result.isUnresolvedConflict).toBe(false);
  });

  it("Step 2: resolves conflict using Recency precedence when tiers match", async () => {
    const stanceOld: { claimText: string; evidence: ClaimVerificationEvidence[] } = {
      claimText: "Node.js recommends using commonjs modules.",
      evidence: [
        {
          sourceId: "src-v16",
          sourceName: "Node.js Foundation Release Docs v16",
          authorityTier: AuthorityTier.TIER_1_OFFICIAL,
          publishedAt: "2021-04-20T00:00:00.000Z",
          claimExcerpt: "CJS is the default module system in Node.js",
          stance: "supports",
          evidenceConfidence: 95,
        },
      ],
    };

    const stanceNew: { claimText: string; evidence: ClaimVerificationEvidence[] } = {
      claimText: "Node.js officially recommends ES modules and provides native support.",
      evidence: [
        {
          sourceId: "src-v22",
          sourceName: "Node.js Foundation Release Docs v22",
          authorityTier: AuthorityTier.TIER_1_OFFICIAL,
          publishedAt: "2024-04-24T00:00:00.000Z",
          claimExcerpt: "ESM is now natively supported with type strip flags.",
          stance: "supports",
          evidenceConfidence: 98,
        },
      ],
    };

    const result = await adjudicator.adjudicateConflict("claim-node-modules", stanceOld, stanceNew);

    expect(result.resolutionStep).toBe("step_2_recency");
    expect(result.winnerClaim).toBe(stanceNew.claimText);
    expect(result.isUnresolvedConflict).toBe(false);
  });

  it("Step 3: surfaces explicit unresolved conflict when tiers and timestamps coincide", async () => {
    const date = "2026-05-01T12:00:00.000Z";
    const stanceA = {
      claimText: "Approach A yields better memory cache locality for high-throughput queues.",
      evidence: [
        {
          sourceId: "study-mit",
          sourceName: "MIT Systems Research Lab",
          authorityTier: AuthorityTier.TIER_2_MAINTAINERS,
          publishedAt: date,
          claimExcerpt: "Array ring buffers show superior L1 cache efficiency.",
          stance: "supports" as const,
          evidenceConfidence: 90,
        },
      ],
    };

    const stanceB = {
      claimText: "Approach B yields higher concurrency throughput without lock contention.",
      evidence: [
        {
          sourceId: "study-stanford",
          sourceName: "Stanford Distributed Systems Lab",
          authorityTier: AuthorityTier.TIER_2_MAINTAINERS,
          publishedAt: date,
          claimExcerpt: "Lock-free linked segments outperform ring buffers under thread contention.",
          stance: "supports" as const,
          evidenceConfidence: 90,
        },
      ],
    };

    const result = await adjudicator.adjudicateConflict("claim-queue-arch", stanceA, stanceB);

    expect(result.resolutionStep).toBe("step_3_unresolved_conflict");
    expect(result.isUnresolvedConflict).toBe(true);
    expect(result.winnerClaim).toBeUndefined();
    expect(result.explanation).toContain("Explicit Unresolved Conflict");
  });
});
