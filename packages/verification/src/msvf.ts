import {
  AuthorityTier,
  ClaimVerificationEvidence,
  MSVFConflictResolutionResult,
} from "@kenora/types";

/**
 * Multi-Source Verification Framework (MSVF) Conflict Adjudication
 * Implements the explicit 3-step precedence policy:
 * 1. Authority Tier (Tier 1 > Tier 2 > Tier 3 > Tier 4)
 * 2. Recency (when tiers match)
 * 3. Explicit Unresolved Conflict (surfaces both stances with full evidence audit)
 */
export interface IMSVFConflictAdjudicator {
  adjudicateConflict(
    claimId: string,
    stanceA: { claimText: string; evidence: ClaimVerificationEvidence[] },
    stanceB: { claimText: string; evidence: ClaimVerificationEvidence[] },
  ): Promise<MSVFConflictResolutionResult>;
}

export class MSVFConflictAdjudicator implements IMSVFConflictAdjudicator {
  async adjudicateConflict(
    claimId: string,
    stanceA: { claimText: string; evidence: ClaimVerificationEvidence[] },
    stanceB: { claimText: string; evidence: ClaimVerificationEvidence[] },
  ): Promise<MSVFConflictResolutionResult> {
    const now = new Date().toISOString();

    // Find highest authority tier for stance A and B (lower number = higher authority)
    const minTierA = stanceA.evidence.length > 0
      ? Math.min(...stanceA.evidence.map((e) => e.authorityTier))
      : AuthorityTier.TIER_4_COMMUNITY;

    const minTierB = stanceB.evidence.length > 0
      ? Math.min(...stanceB.evidence.map((e) => e.authorityTier))
      : AuthorityTier.TIER_4_COMMUNITY;

    // STEP 1: Authority Tier Precedence
    if (minTierA < minTierB) {
      return {
        claimId,
        resolutionStep: "step_1_authority_tier",
        winnerClaim: stanceA.claimText,
        winningTier: minTierA,
        isUnresolvedConflict: false,
        conflictingStances: {
          stanceA: { claimText: stanceA.claimText, sources: stanceA.evidence },
          stanceB: { claimText: stanceB.claimText, sources: stanceB.evidence },
        },
        explanation: `Resolved by Step 1 (Authority Tier): Stance A backed by Tier ${minTierA} authoritative source supersedes Stance B (Tier ${minTierB}).`,
        confidenceScore: 94,
        adjudicatedAt: now,
      };
    } else if (minTierB < minTierA) {
      return {
        claimId,
        resolutionStep: "step_1_authority_tier",
        winnerClaim: stanceB.claimText,
        winningTier: minTierB,
        isUnresolvedConflict: false,
        conflictingStances: {
          stanceA: { claimText: stanceA.claimText, sources: stanceA.evidence },
          stanceB: { claimText: stanceB.claimText, sources: stanceB.evidence },
        },
        explanation: `Resolved by Step 1 (Authority Tier): Stance B backed by Tier ${minTierB} authoritative source supersedes Stance A (Tier ${minTierA}).`,
        confidenceScore: 94,
        adjudicatedAt: now,
      };
    }

    // STEP 2: Recency Precedence (when authority tiers match)
    const latestDateA = stanceA.evidence.length > 0
      ? Math.max(...stanceA.evidence.map((e) => new Date(e.publishedAt).getTime()))
      : 0;

    const latestDateB = stanceB.evidence.length > 0
      ? Math.max(...stanceB.evidence.map((e) => new Date(e.publishedAt).getTime()))
      : 0;

    const timeDiffMs = Math.abs(latestDateA - latestDateB);
    const recencyThresholdMs = 24 * 60 * 60 * 1000; // 24 hours threshold

    if (timeDiffMs > recencyThresholdMs) {
      if (latestDateA > latestDateB) {
        const winningDate = new Date(latestDateA).toISOString();
        return {
          claimId,
          resolutionStep: "step_2_recency",
          winnerClaim: stanceA.claimText,
          winningTier: minTierA,
          winningDate,
          isUnresolvedConflict: false,
          conflictingStances: {
            stanceA: { claimText: stanceA.claimText, sources: stanceA.evidence },
            stanceB: { claimText: stanceB.claimText, sources: stanceB.evidence },
          },
          explanation: `Resolved by Step 2 (Recency): Stance A (${winningDate}) is significantly more recent than Stance B, reflecting subsequent updates or errata.`,
          confidenceScore: 88,
          adjudicatedAt: now,
        };
      } else {
        const winningDate = new Date(latestDateB).toISOString();
        return {
          claimId,
          resolutionStep: "step_2_recency",
          winnerClaim: stanceB.claimText,
          winningTier: minTierB,
          winningDate,
          isUnresolvedConflict: false,
          conflictingStances: {
            stanceA: { claimText: stanceA.claimText, sources: stanceA.evidence },
            stanceB: { claimText: stanceB.claimText, sources: stanceB.evidence },
          },
          explanation: `Resolved by Step 2 (Recency): Stance B (${winningDate}) is significantly more recent than Stance A, reflecting subsequent updates or errata.`,
          confidenceScore: 88,
          adjudicatedAt: now,
        };
      }
    }

    // STEP 3: Explicit Unresolved Conflict
    // When tiers and recency are equivalent, surface both stances with transparent evidence.
    return {
      claimId,
      resolutionStep: "step_3_unresolved_conflict",
      isUnresolvedConflict: true,
      conflictingStances: {
        stanceA: { claimText: stanceA.claimText, sources: stanceA.evidence },
        stanceB: { claimText: stanceB.claimText, sources: stanceB.evidence },
      },
      explanation: `Explicit Unresolved Conflict: Both stances possess identical Authority Tier (${minTierA}) and concurrent publication dates. Kenora presents both perspectives transparently for professional judgment without speculative resolution.`,
      confidenceScore: 50,
      adjudicatedAt: now,
    };
  }
}
