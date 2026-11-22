import { describe, it, expect } from "vitest";
import { SecretAndPiiRedactor } from "./secret-redactor";

describe("Zero-Trust Sensitive Data & Secret Redactor", () => {
  it("should scrub AWS access keys and GitHub personal access tokens", () => {
    const raw = "Deploy key AKIA1234567890ABCDEF and GitHub token ghp_1234567890abcdef1234567890abcdef1234";
    const result = SecretAndPiiRedactor.redact(raw);

    expect(result.sanitizedText).toContain("[REDACTED_AWS_KEY]");
    expect(result.sanitizedText).toContain("[REDACTED_GITHUB_TOKEN]");
    expect(result.sanitizedText).not.toContain("AKIA1234567890ABCDEF");
    expect(result.redactedTypes).toContain("AWS_ACCESS_KEY");
    expect(result.redactedTypes).toContain("GITHUB_PAT");
  });

  it("should scrub LLM API keys and private key blocks", () => {
    const raw = "Use LLM key sk-abcdef1234567890abcdef1234567890\n-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAz\n-----END RSA PRIVATE KEY-----";
    const result = SecretAndPiiRedactor.redact(raw);

    expect(result.sanitizedText).toContain("[REDACTED_LLM_KEY]");
    expect(result.sanitizedText).toContain("[REDACTED_PRIVATE_KEY_BLOCK]");
  });

  it("should scrub database passwords and credit card numbers", () => {
    const raw = "Database uri: postgresql://admin:superSecretPassword123@localhost:5432/kenora and card: 4111-2222-3333-4444";
    const result = SecretAndPiiRedactor.redact(raw);

    expect(result.sanitizedText).toContain("postgresql://***:***@");
    expect(result.sanitizedText).not.toContain("superSecretPassword123");
    expect(result.sanitizedText).toContain("[REDACTED_PAYMENT_CARD]");
  });

  it("should correctly detect presence of sensitive data", () => {
    expect(SecretAndPiiRedactor.hasSensitiveData("Plain benign documentation text.")).toBe(false);
    expect(SecretAndPiiRedactor.hasSensitiveData("Leak: AKIA1111222233334444")).toBe(true);
  });
});
