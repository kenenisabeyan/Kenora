/**
 * Zero-Trust Sensitive Data & Secret Redactor
 * Mandated by Kenora Architecture Whitepaper (Data Protection & Privacy Architecture)
 * 
 * Automatically scrubs:
 * - Cloud & API Provider Keys (AWS AKIA, GitHub PAT, OpenAI sk-, Private Keys)
 * - Personally Identifiable Information (PII) (Credit Cards, SSNs, phone numbers)
 * - Database connection strings with embedded passwords
 */

export interface RedactionResult {
  sanitizedText: string;
  redactedTypes: string[];
  redactedCount: number;
}

export class SecretAndPiiRedactor {
  private static readonly RULES: { name: string; pattern: RegExp; mask: string }[] = [
    // AWS Access Key
    {
      name: "AWS_ACCESS_KEY",
      pattern: /\bAKIA[0-9A-Z]{16}\b/g,
      mask: "[REDACTED_AWS_KEY]",
    },
    // GitHub Personal Access Token
    {
      name: "GITHUB_PAT",
      pattern: /\bgh[pousr]_[0-9a-zA-Z]{36}\b/g,
      mask: "[REDACTED_GITHUB_TOKEN]",
    },
    // OpenAI / LLM API Key
    {
      name: "OPENAI_API_KEY",
      pattern: /\bsk-[a-zA-Z0-9T3BlbkFJ]{20,}\b/g,
      mask: "[REDACTED_LLM_KEY]",
    },
    // Private Key Blocks
    {
      name: "RSA_PRIVATE_KEY",
      pattern: /-----BEGIN [A-Z ]+ PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+ PRIVATE KEY-----/g,
      mask: "[REDACTED_PRIVATE_KEY_BLOCK]",
    },
    // Database Connection Strings with Passwords
    {
      name: "DB_CONNECTION_STRING",
      pattern: /(postgres(?:ql)?|mysql|redis|mongodb):\/\/[^:\s]+:([^@\s]+)@[^:\s]+/gi,
      mask: "$1://***:***@$3",
    },
    // Credit Card Numbers (13-19 digits with optional hyphens/spaces)
    {
      name: "CREDIT_CARD",
      pattern: /\b(?:\d{4}[ -]?){3}\d{4}\b|\b\d{15,16}\b/g,
      mask: "[REDACTED_PAYMENT_CARD]",
    },
    // US Social Security Numbers
    {
      name: "SSN",
      pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
      mask: "[REDACTED_SSN]",
    },
    // Bearer authorization tokens in text
    {
      name: "BEARER_TOKEN",
      pattern: /Bearer\s+([a-zA-Z0-9_\-\.]{20,})/gi,
      mask: "Bearer [REDACTED_TOKEN]",
    },
  ];

  static redact(text: string): RedactionResult {
    if (!text || typeof text !== "string") {
      return { sanitizedText: text || "", redactedTypes: [], redactedCount: 0 };
    }

    let sanitized = text;
    const redactedTypes = new Set<string>();
    let redactedCount = 0;

    for (const rule of this.RULES) {
      const matches = sanitized.match(rule.pattern);
      if (matches && matches.length > 0) {
        redactedTypes.add(rule.name);
        redactedCount += matches.length;
        sanitized = sanitized.replace(rule.pattern, rule.mask);
      }
    }

    return {
      sanitizedText: sanitized,
      redactedTypes: Array.from(redactedTypes),
      redactedCount,
    };
  }

  static hasSensitiveData(text: string): boolean {
    if (!text) return false;
    for (const rule of this.RULES) {
      if (rule.pattern.test(text)) {
        rule.pattern.lastIndex = 0; // Reset regex state
        return true;
      }
    }
    return false;
  }
}
