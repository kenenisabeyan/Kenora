/**
 * Verification Engine & Policy Contracts
 */

export interface VerificationResult {
  itemId: string;
  status: "verified" | "refuted" | "inconclusive" | "unverified";
  confidenceScore: number;
  corroboratingSources: string[];
  contradictingSources: string[];
  reasoning: string;
  verifiedAt: string;
}

export interface IVerificationEngine {
  verifyItem(itemId: string, tenantId: string): Promise<VerificationResult>;
  assessSourceTrust(
    sourceId: string,
  ): Promise<{ trustScore: number; historicalAccuracy: number }>;
}
