/**
 * Kenora AI Safety & Prompt Injection Shield
 * Implements defensive perimeter security against direct & indirect prompt injection,
 * adversarial jailbreaks, and untrusted payload exfiltration across agent clusters.
 */

export interface AISafetyScanResult {
  isSafe: boolean;
  threatLevel: "none" | "low" | "medium" | "critical";
  riskScore: number; // 0 to 100
  flaggedPatterns: string[];
  sanitizedText: string;
}

export class AISafetyShield {
  // Regex patterns targeting standard and obfuscated prompt injection vectors
  private static readonly INJECTION_PATTERNS: Array<{ pattern: RegExp; description: string; score: number }> = [
    {
      pattern: /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|directives|prompts)/i,
      description: "Direct instruction override attempt",
      score: 85,
    },
    {
      pattern: /(disregard|forget)\s+(everything|the\s+rules|system\s+message)/i,
      description: "System rule erasure attempt",
      score: 85,
    },
    {
      pattern: /(you\s+are\s+now|act\s+as)\s+(an\s+unrestricted|a\s+jailbroken|DAN|an\s+evil)/i,
      description: "Adversarial persona adoption / Jailbreak",
      score: 90,
    },
    {
      pattern: /system\s*prompt\s*:\s*/i,
      description: "Fake system prompt injection",
      score: 75,
    },
    {
      pattern: /<\s*script[^>]*>.*?<\s*\/\s*script\s*>/is,
      description: "Embedded cross-site scripting (XSS) payload",
      score: 95,
    },
    {
      pattern: /javascript\s*:\s*/i,
      description: "JavaScript URI pseudo-protocol execution attempt",
      score: 80,
    },
    {
      pattern: /```(json|xml)?\s*\{\s*"admin"\s*:\s*true/i,
      description: "Privilege escalation payload injection",
      score: 70,
    },
    {
      pattern: /(output|reveal|leak|print)\s+(your|the)\s+(initial|system|master)\s+(prompt|instructions)/i,
      description: "System prompt exfiltration probe",
      score: 80,
    },
  ];

  /**
   * Scans an input string for prompt injection, jailbreaks, and malicious vectors.
   */
  static scan(text: string): AISafetyScanResult {
    if (!text || typeof text !== "string") {
      return {
        isSafe: true,
        threatLevel: "none",
        riskScore: 0,
        flaggedPatterns: [],
        sanitizedText: "",
      };
    }

    const flaggedPatterns: string[] = [];
    let cumulativeRisk = 0;

    for (const rule of this.INJECTION_PATTERNS) {
      if (rule.pattern.test(text)) {
        flaggedPatterns.push(rule.description);
        cumulativeRisk += rule.score;
      }
    }

    // Bounded risk score in [0, 100]
    const riskScore = Math.min(100, cumulativeRisk);

    let threatLevel: "none" | "low" | "medium" | "critical" = "none";
    if (riskScore >= 80) threatLevel = "critical";
    else if (riskScore >= 50) threatLevel = "medium";
    else if (riskScore > 0) threatLevel = "low";

    // Neutralize dangerous tags if present
    const sanitizedText = text
      .replace(/<\s*script[^>]*>.*?<\s*\/\s*script\s*>/gis, "[REDACTED_SCRIPT_BLOCK]")
      .replace(/javascript\s*:\s*/gi, "blocked-javascript:");

    return {
      isSafe: threatLevel !== "critical" && threatLevel !== "medium",
      threatLevel,
      riskScore,
      flaggedPatterns,
      sanitizedText,
    };
  }

  /**
   * Enforces safety: throws if input exceeds acceptable risk threshold
   */
  static assertSafe(text: string, maxAllowedRisk = 45): string {
    const result = this.scan(text);
    if (!result.isSafe || result.riskScore > maxAllowedRisk) {
      throw new Error(
        `AI_SAFETY_VIOLATION: Input rejected due to threat level '${result.threatLevel}' (Risk: ${result.riskScore}). Flagged: ${result.flaggedPatterns.join(", ")}`
      );
    }
    return result.sanitizedText;
  }
}
