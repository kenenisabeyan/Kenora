# ADR-0002: Identity, Authentication & Multi-Tenancy Architecture

- **Status**: Accepted
- **Date**: 2026-10-02
- **Deciders**: Kenora Engineering Team

## Context

Kenora requires a production-grade identity, multi-tenancy, authentication, and authorization system. The security model must support multiple organizations per user, strict tenant isolation across database queries and background workers, role-based access control (RBAC), and server-side session rotation.

## Decisions

1. **AsyncLocalStorage Tenant Context**: Context propagation uses Node's `node:async_hooks` (`AsyncLocalStorage`) via `TenantContext.run(...)`. This eliminates static memory race conditions in concurrent asynchronous requests.
2. **Server-Side Session Architecture**: Authentication uses cryptographically secure random session tokens mapped to database session records with HttpOnly cookie support and rotation on login/privilege changes.
3. **Password Security**: Passwords are hashed using `bcrypt` with salt rounds = 12. Plaintext passwords, tokens, and hashes are strictly omitted from error logs and response DTOs.
4. **Explicit Multi-Tenancy**: Every organization-owned database record contains an explicit `organization_id` foreign key indexed in PostgreSQL to enforce database-level query isolation.
5. **Centralized Authorization (`AuthorizationService`)**: Permission checking maps `OWNER`, `ADMIN`, and `MEMBER` roles to granular permissions (`organization:update`, `project:read`, `knowledge:read`, etc.) and enforces resource-ownership matching (`activeOrgId === resource.organizationId`).
6. **Worker Job Tenant Context**: Background jobs explicitly transport `organizationId` in payloads and re-establish trusted execution context via `TenantContext.run(...)`.

## Consequences

- Frontend clients cannot manipulate client-side headers or state to bypass authorization.
- Account enumeration is mitigated via generic error messages (`AUTH_INVALID_CREDENTIALS`).
- Cross-tenant data leaks across API endpoints and worker daemons are systematically prevented.
