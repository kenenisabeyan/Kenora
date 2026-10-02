# Security Policy

## Security Architecture & Core Rules

1. **Untrusted Data Boundary**: External content from the web or third-party adapters is treated as data, NEVER authority.
2. **Tenant Isolation**: Tenant boundaries are strictly enforced across queries and API boundaries.
3. **No Secret Exposure**: Credentials, tokens, and API keys must never be logged or committed.

## Reporting Security Vulnerabilities

If you discover a potential security issue, please notify security@kenora.ai immediately.
