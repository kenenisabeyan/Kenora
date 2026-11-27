/**
 * Autonomous Noise Identification (ANI) Engine
 * Proprietary Technology #6 from the Kenora Whitepaper
 * Evaluates semantic substance, rejects promotional churn, listicles, and marketing spam.
 */

export interface NoiseAnalysisResult {
  isAccepted: boolean;
  signalScore: number; // 0 to 100
  rejectionReasons: string[];
  metrics: {
    hasCodeArtifacts: boolean;
    hasFormalCitations: boolean;
    hasPromotionalMarkers: boolean;
    textLength: number;
    substanceDensity: number;
  };
}

export class AutonomousNoiseIdentifier {
  private promotionalPatterns = [
    /\b(?:game[- ]?changer|you won['’]?t believe|mind[- ]?blowing|revolutionary|disruptive|10x engineer|secret sauce)\b/i,
    /\b(?:top \d+ reasons|why you should switch|ultimate guide to everything)\b/i,
    /\b(?:smash that like|subscribe for more|sponsor(?:ed)? post)\b/i,
  ];

  private formalCitationPatterns = [
    /\b(?:RFC\s*\d+|CVE-\d{4}-\d+|W3C|TC39|ISO\/IEC|NIST|IEEE|PEP\s*\d+)\b/i,
    /https?:\/\/(?:datatracker\.ietf\.org|nvd\.nist\.gov|github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/releases|w3\.org)/i,
  ];

  private codeArtifactPatterns = [
    /```(?:typescript|javascript|rust|go|python|sql|json|bash|sh)?[\s\S]*?```/,
    /\b(?:const|let|function|import\s+.*?from|export\s+default|class\s+\w+|interface\s+\w+)\b/,
  ];

  evaluate(text: string, title?: string): NoiseAnalysisResult {
    const fullText = `${title || ""} ${text}`;
    const rejectionReasons: string[] = [];

    // Check minimum meaningful length
    if (fullText.trim().length < 80) {
      rejectionReasons.push("Insufficient text length for technical claim extraction");
    }

    // Check promotional markers
    let promotionalHits = 0;
    for (const pattern of this.promotionalPatterns) {
      if (pattern.test(fullText)) {
        promotionalHits++;
      }
    }

    const hasPromotionalMarkers = promotionalHits > 0;
    if (promotionalHits >= 2) {
      rejectionReasons.push("High density of promotional marketing markers detected");
    }

    // Check code artifacts & technical tokens
    const hasCodeArtifacts = this.codeArtifactPatterns.some((p) => p.test(fullText));

    // Check formal standards / primary citations
    const hasFormalCitations = this.formalCitationPatterns.some((p) => p.test(fullText));

    // Base score calculation
    let signal = 50;
    if (hasFormalCitations) signal += 30;
    if (hasCodeArtifacts) signal += 20;
    if (hasPromotionalMarkers) signal -= 25 * promotionalHits;
    if (fullText.length > 500) signal += 10;

    const signalScore = Math.min(100, Math.max(0, signal));
    const isAccepted = signalScore >= 60 && rejectionReasons.length === 0;

    if (!isAccepted && rejectionReasons.length === 0) {
      rejectionReasons.push("Signal-to-noise ratio below threshold (minimum 60 required)");
    }

    return {
      isAccepted,
      signalScore,
      rejectionReasons,
      metrics: {
        hasCodeArtifacts,
        hasFormalCitations,
        hasPromotionalMarkers,
        textLength: fullText.length,
        substanceDensity: signalScore / 100,
      },
    };
  }
}
