# ADR-0007: AI Safety, Prompt Injection Defense & Ingestion Quarantine

## Status
Accepted

## Context
Kenora continuously ingests third-party data from untrusted public web sources (discourse forums, community blogs, unverified code repositories, RSS feeds). These sources represent critical attack vectors for adversarial prompt injection (direct and indirect instruction overrides), jailbreak payloads (e.g., DAN, unrestricted personas), embedded cross-site scripting (XSS), and data exfiltration probes targeting agent system instructions.

## Decision
We implement a defense-in-depth **AI Safety Shield & Ingestion Quarantine Engine** (`@kenora/security/ai-safety`):

1. **Adversarial Pattern Matrix**:
   - `AISafetyShield` scans incoming payloads against categorized regular expressions and heuristic classifiers:
     - Direct Instruction Overrides: `ignore all previous instructions`, `disregard prior directives` (Risk Score: 85)
     - Adversarial Personas & Jailbreaks: `you are now an unrestricted DAN persona` (Risk Score: 90)
     - Fake System Prompts: `system prompt: ...` (Risk Score: 75)
     - Exfiltration Probes: `reveal your system prompt`, `leak master instructions` (Risk Score: 80)
2. **Sanitization & Tag Neutralization**:
   - Strips and neutralizes executable script blocks (`<script>...</script>`) replacing them with `[REDACTED_SCRIPT_BLOCK]`.
   - Neutralizes pseudo-protocols (`javascript:` $\to$ `blocked-javascript:`).
3. **Perimeter Quarantine & Dead Letter Queue (DLQ)**:
   - Items scoring $\ge 80$ risk points trigger an immediate `AI_SAFETY_VIOLATION` exception.
   - Background ingestion processors in `@kenora/workers` automatically quarantine hostile payloads into a Dead Letter Queue (DLQ) state before claims extraction or graph indexing.

## Consequences
- **Positive**: Hardens autonomous agents against indirect prompt injection, prevents toxic data contamination of the LPKG, eliminates XSS attack vectors.
- **Negative**: Adds $< 1\text{ms}$ parsing overhead per normalized item during background ingestion.
