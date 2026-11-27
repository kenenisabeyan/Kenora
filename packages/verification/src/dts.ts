import { AuthorityTier } from "@kenora/types";

/**
 * Dynamic Trust Scoring (DTS) Engine
 * Implements time-decaying source reliability calibration:
 * T(s, t) = T_0(s) * e^(-lambda * (t - t_0)) + delta_accuracy(s)
 */
export interface SourceReputationRecord {
  sourceId: string;
  sourceName: string;
  authorityTier: AuthorityTier;
  baselineTrust: number; // 0 to 100
  currentTrustScore: number; // 0 to 100
  verifiedClaimsCount: number;
  refutedClaimsCount: number;
  lastEvaluatedAt: string;
  halfLifeDays: number;
}

export interface IDynamicTrustScorer {
  calculateDecayedTrust(record: SourceReputationRecord, asOf?: Date): number;
  recordVerificationOutcome(
    sourceId: string,
    outcome: "corroborated" | "refuted",
  ): SourceReputationRecord;
  getSourceReputation(sourceId: string): SourceReputationRecord | null;
  registerSource(
    sourceId: string,
    sourceName: string,
    authorityTier: AuthorityTier,
    baselineTrust?: number,
  ): SourceReputationRecord;
}

export class DynamicTrustScorer implements IDynamicTrustScorer {
  private sources = new Map<string, SourceReputationRecord>();

  constructor() {
    // Seed default authoritative infrastructure sources
    this.registerSource("ietf-rfc", "IETF RFC Datatracker", AuthorityTier.TIER_1_OFFICIAL_STANDARD, 99);
    this.registerSource("nist-nvd", "NIST National Vulnerability Database", AuthorityTier.TIER_1_OFFICIAL_STANDARD, 98);
    this.registerSource("w3c-specs", "W3C Working Group Standards", AuthorityTier.TIER_1_OFFICIAL_STANDARD, 97);
    this.registerSource("nodejs-releases", "Node.js Core Release WG", AuthorityTier.TIER_1_OFFICIAL_STANDARD, 96);
    this.registerSource("vendor-docs", "Official Vendor Reference Documentation", AuthorityTier.TIER_2_VENDOR_DOCUMENTATION, 88);
    this.registerSource("community-forum", "General Technical Discourse", AuthorityTier.TIER_4_COMMUNITY, 60);
  }

  registerSource(
    sourceId: string,
    sourceName: string,
    authorityTier: AuthorityTier,
    baselineTrust?: number,
  ): SourceReputationRecord {
    const defaultBaseline =
      authorityTier === AuthorityTier.TIER_1_OFFICIAL_STANDARD
        ? 95
        : authorityTier === AuthorityTier.TIER_2_VENDOR_DOCUMENTATION
        ? 85
        : authorityTier === AuthorityTier.TIER_3_INDEPENDENT_RESEARCH
        ? 80
        : 60;

    const baseline = baselineTrust ?? defaultBaseline;
    const now = new Date().toISOString();

    const record: SourceReputationRecord = {
      sourceId,
      sourceName,
      authorityTier,
      baselineTrust: baseline,
      currentTrustScore: baseline,
      verifiedClaimsCount: 10,
      refutedClaimsCount: 0,
      lastEvaluatedAt: now,
      halfLifeDays: 90, // 90 days half-life for empirical decay
    };

    this.sources.set(sourceId, record);
    return record;
  }

  getSourceReputation(sourceId: string): SourceReputationRecord | null {
    const record = this.sources.get(sourceId);
    if (!record) return null;
    return { ...record };
  }

  calculateDecayedTrust(record: SourceReputationRecord, asOf: Date = new Date()): number {
    const lastEval = new Date(record.lastEvaluatedAt).getTime();
    const current = asOf.getTime();
    const elapsedDays = Math.max(0, (current - lastEval) / (1000 * 60 * 60 * 24));

    // lambda = ln(2) / halfLifeDays
    const lambda = Math.LN2 / (record.halfLifeDays || 90);
    const decayFactor = Math.exp(-lambda * elapsedDays);

    // Dynamic empirical accuracy adjustment
    const totalEvals = record.verifiedClaimsCount + record.refutedClaimsCount;
    const empiricalAccuracy =
      totalEvals > 0 ? (record.verifiedClaimsCount / totalEvals) * 100 : record.baselineTrust;

    // Blended score: 70% empirical accuracy + 30% decayed baseline
    const blended = 0.7 * empiricalAccuracy + 0.3 * (record.baselineTrust * decayFactor);

    // Bounded in [0, 100]
    return Math.round(Math.min(100, Math.max(0, blended)) * 10) / 10;
  }

  recordVerificationOutcome(
    sourceId: string,
    outcome: "corroborated" | "refuted",
  ): SourceReputationRecord {
    let record = this.sources.get(sourceId);
    if (!record) {
      record = this.registerSource(sourceId, sourceId, AuthorityTier.TIER_4_COMMUNITY);
    }

    if (outcome === "corroborated") {
      record.verifiedClaimsCount += 1;
    } else {
      record.refutedClaimsCount += 1;
    }

    record.lastEvaluatedAt = new Date().toISOString();
    record.currentTrustScore = this.calculateDecayedTrust(record);

    this.sources.set(sourceId, record);
    return { ...record };
  }
}
