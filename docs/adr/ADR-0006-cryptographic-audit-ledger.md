# ADR-0006: Cryptographic Audit Ledger & Secret Redaction Engine

## Status
Accepted

## Context
Enterprise compliance standards (SOC 2 Type II, ISO 27001, GDPR Article 30) mandate immutable, tamper-evident logs for sensitive administrative actions, tenant boundary mutations, and epistemic fact adjudication. Furthermore, external ingested data and error logs frequently contain accidental secret leaks (AWS credentials, GitHub PATs, LLM keys, credit cards).

## Decision
We implement a **Zero-Trust Cryptographic Audit Ledger** and **Deterministic Secret Redactor**:

1. **SHA-256 Merkle Block Hash-Chaining**:
   - Every sensitive event produces a block chained from Genesis ($H_0$) to the current Tip:
     $$H_i = \text{SHA256}\left(i \;\|\; H_{i-1} \;\|\; \text{timestamp} \;\|\; \text{tenantId} \;\|\; \text{eventType} \;\|\; \text{payloadHash}\right)$$
   - Tampering with any historical record invalidates the entire subsequent chain.
   - The integrity probe `GET /api/v1/audit-logs/integrity` iterates through all blocks to detect any hash discrepancies.
2. **Deterministic Multi-Pattern Secret & PII Scrubbing**:
   - `SecretAndPiiRedactor` sanitizes all inputs and audit logs prior to database persistence:
     - AWS Keys (`AKIA...`) $\to$ `[REDACTED_AWS_KEY]`
     - GitHub Personal Access Tokens (`ghp_...`) $\to$ `[REDACTED_GITHUB_PAT]`
     - OpenAI/Anthropic Keys (`sk-...`) $\to$ `[REDACTED_API_KEY]`
     - RSA / EC Private Keys (`BEGIN.*PRIVATE KEY`) $\to$ `[REDACTED_PRIVATE_KEY]`
     - Database connection strings with credentials $\to$ `user:***@host`
     - Credit Card numbers (Luhn) & SSNs $\to$ `[REDACTED_PII]`

## Consequences
- **Positive**: Cryptographic proof of non-repudiation, automated compliance verification, zero plaintext secret exposure.
- **Negative**: Redaction incurs small CPU overhead on ingestion, mitigated by precompiled regex patterns ($< 2\text{ms}$).
