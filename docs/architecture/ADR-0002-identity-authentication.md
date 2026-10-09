# ADR-0002: Identity, Session Authentication & Multi-Tenancy Boundary Architecture

## Status
Accepted

## Context
Kenora Phase 0 established monorepo foundations. Phase 1 requires establishing production identity, server-managed session authentication, role-based authorization (RBAC), and multi-tenant organization isolation.

## Decision
1. **Server-Managed Session Architecture:** Use cryptographically generated 256-bit session tokens stored in a server session repository and delivered via HttpOnly/SameSite cookies or Authorization Bearer headers.
2. **Decoupled Security Concerns:** Authentication ("Who are you?"), Authorization ("What can you do?"), and Tenant Isolation ("Which org's data?") are maintained as separate decoupled services.
3. **AsyncLocalStorage Tenant Context:** Use Node.js `AsyncLocalStorage` for request-scoped and background-job-scoped tenant identity context.
4. **Bcrypt Password Security:** Enforce bcrypt hashing (12 salt rounds in prod, 4 in test).
5. **Rate Limiting & Account Enumeration:** Implement sliding window rate limiting and non-enumerating generic auth responses.
6. **Drizzle ORM PostgreSQL Migrations:** Manage SQL schemas and migrations through Drizzle Kit (`drizzle-kit generate`).

## Consequences
* High multi-tenant isolation and security.
* Clear architectural boundary for Phase 2 intelligence integrations.
