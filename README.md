# Kenora — AI-Powered Professional Intelligence Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-EF4444.svg?logo=turborepo)](https://turbo.build/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS%2010-E0234E.svg?logo=nestjs)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black.svg?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20pgvector-336791.svg?logo=postgresql)](https://github.com/pgvector/pgvector)
[![Redis](https://img.shields.io/badge/Cache%20%26%20Queues-Redis%20%2B%20BullMQ-DC382D.svg?logo=redis)](https://redis.io/)
[![NATS](https://img.shields.io/badge/Event%20Mesh-NATS%20JetStream-27AAE1.svg?logo=nats.io)](https://nats.io/)
[![Vitest](https://img.shields.io/badge/Testing-Vitest-6E9F18.svg?logo=vitest)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-Proprietary-gray.svg)](#)

Kenora is an enterprise-grade, source-agnostic **AI Professional Knowledge & Intelligence Platform**. It ingests fragmented multi-source domain knowledge, normalizes and deduplicates data streams, extracts semantic claim triples, performs Bayesian cross-source corroboration, and delivers hybrid precision search (lexical BM25 + dense semantic vector retrieval via Reciprocal Rank Fusion) with strict multi-tenant isolation.

---

## 🏛️ System Architecture & Execution Topology

Kenora is architected as a clean, modular TypeScript monorepo powered by **pnpm workspaces** and **Turborepo**.

```mermaid
flowchart TD
    subgraph ClientBoundary ["1. Client & Edge Layer (apps/web)"]
        Browser[Client Web Application] --> EdgeMW["Next.js Edge Middleware<br/>(CSP, HSTS, Route Protection, Correlation ID)"]
    end

    subgraph ApiGateway ["2. NestJS API Platform (apps/api - Port 4000)"]
        EdgeMW --> RateGuard["RateLimitGuard (Sliding-Window IP/Email Limiter)"]
        RateGuard --> AuthGuard["SessionAuthGuard (Bearer ses_... Token Resolution)"]
        AuthGuard --> TenantALS["TenantContextInterceptor (AsyncLocalStorage Binding)"]
        TenantALS --> PermGuard["PermissionsGuard (RolePermissionMatrix Enforcement)"]
        PermGuard --> ValPipe["ValidationPipe (Zod DTO Whitelisting & Transform)"]
        ValPipe --> Controllers["Modular REST Controllers & OpenAPI 3.0 (/docs)"]
    end

    subgraph ServiceStorage ["3. Domain Services & Persistence Layer"]
        Controllers --> Services["Domain Business Logic Services"]
        Services --> DB[("PostgreSQL + Drizzle ORM<br/>(Row-Level Security & pgvector 1536-dim)")]
        Services --> Cache[("Redis Cluster<br/>(Session Tokens & Sliding Windows)")]
        Services --> JetStream["NATS JetStream (Domain Event Backbone)"]
    end

    subgraph WorkerCluster ["4. Background Worker Subsystem (apps/workers)"]
        JetStream --> BullMQ["BullMQ Distributed Job Queues"]
        BullMQ --> IngestProc["IngestionProcessor (AsyncLocalStorage Scoped)"]
        IngestProc --> Adapters["Source Adapters (GitHub, RSS, Web)"]
        IngestProc --> Pipeline["Knowledge Pipeline (Normalize, Dedup, Claims)"]
        IngestProc --> Verifier["Bayesian Verification Engine"]
        Verifier --> DB
    end

    classDef client fill:#1e293b,stroke:#64748b,color:#f8fafc;
    classDef gateway fill:#0f766e,stroke:#14b8a6,color:#f8fafc;
    classDef storage fill:#4338ca,stroke:#6366f1,color:#f8fafc;
    classDef workers fill:#7c2d12,stroke:#ea580c,color:#f8fafc;
    class ClientBoundary client;
    class ApiGateway gateway;
    class ServiceStorage storage;
    class WorkerCluster workers;
```

---

## ⚡ Core Architectural Pillars & Quality Attributes

### 1. Zero-Trust Security & Multi-Tenancy
* **Dual-Layer Isolation (Defense-in-Depth)**:
  - **Application Scope**: Ambient execution context managed by `node:async_hooks` (`TenantContext`), strictly isolating tenant context across promise chains.
  - **Database Kernel Scope**: PostgreSQL Row-Level Security (RLS) policies enforcing `organization_id = current_setting('app.current_tenant_id')::uuid`.
* **Cryptographic Invariants**:
  - Session tokens generated via CSPRNG with 256-bit entropy (`ses_<64_hex_chars>`).
  - Adaptive `bcryptjs` password hashing (12 rounds in production, 4 rounds in test).
  - Side-channel timing attack mitigation via `crypto.timingSafeEqual` for all token validations.
* **Prompt Injection Sandboxing**:
  - `ExternalDataSanitizer` cleans ASCII control characters, strips `<script>` tags, and wraps external inputs in `<untrusted_external_content>` tags.

### 2. High-Performance Hybrid Search Engine (`@kenora/search`)
* **Multi-Modal Retrieval**:
  - **Sparse Lexical**: Exact-match keyword frequency with title-weighting ($3\times$ multiplier).
  - **Dense Semantic**: Cosine distance ($d_{\text{cos}} = 1 - (\mathbf{u} \cdot \mathbf{v})$) over 1536-dimensional embeddings indexed via HNSW graphs ($O(\log N)$ search latency, $p95 < 20\text{ms}$).
  - **Reciprocal Rank Fusion (RRF)**: Merges dense and sparse rankings using smoothing parameter $k = 60$:
    $$S_{\text{RRF}}(d) = \frac{0.35}{60 + r_{\text{lexical}}(d)} + \frac{0.65}{60 + r_{\text{semantic}}(d)}$$

### 3. Bayesian Fact Verification Engine (`@kenora/verification`)
* **Dynamic Evidence Updating**:
  - Evaluates corroborating sources versus contradicting sources to compute posterior confidence scores ($0$ to $100$):
    $$\text{ConfidenceScore} = \min\left(100, \; \max\left(0, \; 75 + 10 \cdot |\mathcal{S}^+| - 25 \cdot |\mathcal{S}^-|\right)\right)$$
* **Verification State Transitions**:
  - $\ge 80 \implies \mathbf{verified}$
  - Contradictions exceed corroborations $\implies \mathbf{refuted}$
  - $50 \le \text{Score} < 80 \implies \mathbf{inconclusive}$
* **Dynamic Source Trust Tracking**:
  - Computes historical accuracy per source adapter, penalizing inaccurate feeds over time.

### 4. Reliability & Resilience Engine (`@kenora/observability`)
* **Circuit Breaker (`CircuitBreaker`)**:
  - Prevents cascading thread exhaustion by transitioning between `CLOSED`, `OPEN`, and `HALF_OPEN` states upon reaching configurable failure thresholds.
* **Decorrelated Exponential Backoff with Full Random Jitter (`BackoffRetry`)**:
  - Mitigates "thundering herd" spikes when retrying external APIs:
    $$t_{\text{sleep}} = \min\left(t_{\text{max}}, \; \text{Uniform}\left(0, \; t_{\text{base}} \cdot 2^{\text{attempt}}\right)\right)$$

### 5. High Availability & Cloud Probes (`apps/api`)
* **Deep Health Probe (`GET /api/v1/health`)**: Validates database connection pools, Redis latency, and NATS JetStream connectivity.
* **Kubernetes Liveness Probe (`GET /api/v1/health/liveness`)**: Verifies process responsiveness and reports uptime.
* **Kubernetes Readiness Probe (`GET /api/v1/health/readiness`)**: Confirms downstream subsystem readiness before routing traffic.

### 6. Transparency, Explainability & Auditability
* **Immutable Compliance Audit Ledger (`GET /api/v1/audit-logs`)**:
  - RBAC-guarded (`SETTINGS_READ`) endpoint exposing tamper-evident logs for security compliance (**SOC 2 Type II**, **ISO 27001**, **GDPR Article 30**).
* **Explainable AI (XAI)**:
  - Every verified claim includes evidence provenance: status, confidence score, corroborating and contradicting source IDs, and reasoning traces.

### 7. Openness & Portability
* **OpenAPI 3.0 / Swagger**: Interactive API specifications mounted at `/docs`.
* **RFC 7807 Problem Details**: Standardized machine-readable error communication.
* **Zero Vendor Lock-In**:
  - **Model Portability**: Pluggable `ModelGateway` interface supporting OpenAI, Anthropic, Gemini, or local models (Ollama/vLLM).
  - **Storage Portability**: S3-compliant interface compatible with AWS S3, Cloudflare R2, MinIO, or LocalStack.
  - **Database Portability**: Standard PostgreSQL with `pgvector` runs across AWS Aurora, GCP Cloud SQL, Azure, bare-metal, or Docker.

---

## 📂 Workspace Structure & Directory Map

```text
kenora/
├── apps/
│   ├── api/                  # NestJS REST & OpenAPI Platform (Guards, Interceptors, Filters)
│   │   ├── src/common/       # SessionAuthGuard, PermissionsGuard, RateLimitGuard, TenantContextInterceptor
│   │   ├── src/modules/      # Auth, Organizations, Sources, Knowledge, Audit, Health
│   │   └── src/main.ts       # Global pipes, exception filters, interceptors & Swagger
│   ├── web/                  # Next.js 15 App Router Frontend & Dashboard
│   │   ├── app/              # Routes, UI layouts, server components
│   │   └── middleware.ts     # Edge security headers (CSP, HSTS) & session redirects
│   └── workers/              # Background Worker Daemon
│       ├── src/processors/   # IngestionProcessor (Tenant-isolated poll, dedup, claims, verify)
│       └── src/main.ts       # Worker initialization & BullMQ listeners
│
├── packages/
│   ├── api-contracts/        # Shared Zod validation schemas for requests & query parameters
│   ├── config/               # Zod-validated environment configurations (fail-fast security checks)
│   ├── database/             # Drizzle ORM PostgreSQL schema (pgvector, RLS, indexes)
│   ├── domain/               # Core domain entities & repository interface contracts
│   ├── events/               # Domain event topics & NATS JetStream event definitions
│   ├── knowledge/            # Pipeline processor: normalization, SHA-256 deduplication, claims
│   ├── memory/               # Tri-tier memory architecture (working, short-term, long-term, episodic)
│   ├── observability/        # Pino logger, CorrelationContext (ALS), CircuitBreaker, BackoffRetry
│   ├── search/               # HybridSearchEngine (lexical BM25, semantic cosine, RRF k=60)
│   ├── security/             # TenantContext (ALS), AuthorizationService (RBAC), RateLimiter, Hasher
│   ├── source-adapters/      # SourceAdapterRegistry, GitHubSourceAdapter, GenericWebAdapter
│   ├── types/                # Canonical TypeScript DTOs, APIResponse<T>, PaginatedResult<T>
│   ├── verification/         # BayesianVerificationEngine (corroboration, contradiction, trust scores)
│   └── ai/                   # ModelGateway provider-agnostic LLM & embedding interface
│
├── docs/                     # Architecture Decision Records (ADRs) & Security Specifications
└── package.json              # Monorepo scripts, Turbo pipeline & shared devDependencies
```

---

## 📡 Complete API Route & Contract Reference

All REST endpoints in `apps/api` are versioned under `/api/v1` and documented interactively via OpenAPI at `http://localhost:4000/docs`.

| Module | HTTP Method & Route | Auth Guard | Required RBAC | Rate Limit | Primary Request Contract | Primary Success Response |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **Health** | `GET /api/v1/health` | Public | None | None | None | `HealthCheckStatus` |
| **Health** | `GET /api/v1/health/liveness` | Public | None | None | None | `{ status, uptimeSeconds }` |
| **Health** | `GET /api/v1/health/readiness` | Public | None | None | None | `{ status, ready, checks }` |
| **Auth** | `POST /api/v1/auth/register` | Public | None | 5 req / 60s | `RegisterInput` | `APIResponse<AuthSessionDTO>` |
| **Auth** | `POST /api/v1/auth/login` | Public | None | 5 req / 60s | `LoginInput` | `APIResponse<AuthSessionDTO>` |
| **Auth** | `GET /api/v1/auth/me` | Bearer Token | Active Session | None | None | `APIResponse<AuthSessionDTO>` |
| **Auth** | `POST /api/v1/auth/logout` | Bearer Token | Active Session | None | None | `APIResponse<{ message }>` |
| **Auth** | `POST /api/v1/auth/verify-email` | Public | None | None | `VerifyEmailInput` | `APIResponse<{ message }>` |
| **Auth** | `POST /api/v1/auth/switch-organization` | Bearer Token | Org Member | None | `SwitchOrgInput` | `APIResponse<AuthSessionDTO>` |
| **Auth** | `POST /api/v1/auth/change-password` | Bearer Token | Active Session | None | `ChangePasswordInput` | `APIResponse<{ message }>` |
| **Auth** | `POST /api/v1/auth/forgot-password` | Public | None | 3 req / 60s | `ForgotPasswordInput` | `APIResponse<{ message }>` |
| **Auth** | `POST /api/v1/auth/reset-password` | Public | None | None | `ResetPasswordInput` | `APIResponse<{ message }>` |
| **Organizations** | `GET /api/v1/organizations` | Bearer Token | Active Session | None | None | `APIResponse<OrganizationDTO[]>` |
| **Organizations** | `POST /api/v1/organizations` | Bearer Token | Active Session | None | `CreateOrgInput` | `APIResponse<{ org, membership }>` |
| **Organizations** | `GET /api/v1/organizations/:id` | Bearer Token | Org Member | None | `:id` param | `APIResponse<OrganizationDTO>` |
| **Organizations** | `GET /api/v1/organizations/:id/members` | Bearer Token | `member:read` | None | `:id` param | `APIResponse<MembershipDTO[]>` |
| **Organizations** | `POST /api/v1/organizations/:id/members` | Bearer Token | `member:invite` | None | `:id` param, `InviteMemberInput` | `APIResponse<MembershipDTO>` |
| **Knowledge** | `GET /api/v1/knowledge` | Bearer Token | Org Member | None | `QueryKnowledgeInput`, `mode` | `APIResponse<PaginatedResult<DTO>>` |
| **Knowledge** | `POST /api/v1/knowledge/:id/verify` | Bearer Token | `knowledge:update` | None | `:id` param | `APIResponse<VerificationResult>` |
| **Sources** | `GET /api/v1/sources` | Bearer Token | Org Member | None | None | `APIResponse<SourceDTO[]>` |
| **Sources** | `POST /api/v1/sources` | Bearer Token | Org Member | None | `CreateSourceInput` | `APIResponse<SourceDTO>` |
| **Audit** | `GET /api/v1/audit-logs` | Bearer Token | `settings:read` | None | Query options (`eventType`, `page`) | `APIResponse<PaginatedResult<Log>>` |

---

## 🚦 Declarative Request Lifecycle & Middleware Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor Client
    participant Edge as Next.js Edge Middleware
    participant Rate as RateLimitGuard
    participant Auth as SessionAuthGuard
    participant Tenant as TenantContextInterceptor (ALS)
    participant RBAC as PermissionsGuard
    participant Pipe as ValidationPipe
    participant Ctrl as Controller & Service
    participant Resp as TransformResponseInterceptor

    Client->>Edge: HTTP Request + Bearer ses_...
    Edge->>Edge: Inject x-correlation-id & Security Headers (CSP, HSTS)
    Edge->>Rate: Forward Request
    Rate->>Rate: Check Sliding-Window (IP / Email Key)
    Rate->>Auth: Pass
    Auth->>Auth: Validate ses_... & resolve Active Organization
    Auth->>Tenant: Pass with request.session & request.activeOrganizationId
    Tenant->>Tenant: TenantContext.run({ tenantId, userId, correlationId }, ...)
    Tenant->>RBAC: Pass in Ambient Context
    RBAC->>RBAC: Validate RolePermissionMatrix against Target Org
    RBAC->>Pipe: Pass
    Pipe->>Pipe: Validate & Strip non-whitelisted payload fields via Zod
    Pipe->>Ctrl: Dispatch to Handler
    Ctrl->>Ctrl: Execute Business Logic (Database, Verification, RRF Search)
    Ctrl-->>Resp: Return raw payload or DTO
    Resp-->>Client: Wrap in standard APIResponse<T> with metadata & 200 OK
```

---

## 🛠️ Quickstart & Local Development

### Prerequisites
* **Node.js**: `>= 20.0.0`
* **Package Manager**: `pnpm >= 9.0.0`
* **Docker & Docker Compose**: For local PostgreSQL (`pgvector`), Redis, and NATS JetStream

### 1. Installation
```bash
git clone https://github.com/your-org/kenora.git
cd kenora
pnpm install
```

### 2. Infrastructure Spin-Up
Launch local supporting services (Postgres + pgvector, Redis, NATS, MinIO):
```bash
docker compose up -d
```

### 3. Database Migration
Push database schemas and indexes via Drizzle ORM:
```bash
pnpm db:push
```

### 4. Running Development Servers
Start all applications concurrently via Turborepo:
```bash
pnpm dev
```
* **Web Client Dashboard**: `http://localhost:3000`
* **NestJS REST API Platform**: `http://localhost:4000/api/v1`
* **Interactive OpenAPI (Swagger) Docs**: `http://localhost:4000/docs`
* **Worker Ingestion Daemon**: Port `4001`

### 5. Running Tests & Type Checks
```bash
# Run unit tests across all applications and packages
pnpm test

# Run strict TypeScript type verification across workspaces
pnpm type-check
```

---

## 🔒 Configuration & Environment Variables

Environment variables are validated on boot via **Zod** in [`@kenora/config`](file:///c:/Users/kenenisa/Desktop/about%20kenenisa/My%20pojects/Kenora/packages/config/src/index.ts). If required configuration is missing or insecure, startup fails immediately:

| Environment Variable | Default Value | Description | Production Requirement |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | `development` | Runtime environment (`development`, `test`, `production`) | Must be explicitly set |
| `PORT` | `4000` | HTTP port for NestJS API | Required |
| `WEB_PORT` | `3000` | Next.js frontend port | Required |
| `WORKER_PORT` | `4001` | Background worker management port | Required |
| `DATABASE_URL` | `postgresql://kenora:...@localhost:5432/kenoradb` | PostgreSQL connection string | Production database pool |
| `REDIS_URL` | `redis://localhost:6379` | Redis cluster or standalone endpoint | High-availability Redis |
| `NATS_URL` | `nats://localhost:4222` | NATS JetStream event mesh endpoint | Clustered NATS |
| `JWT_SECRET` | `super-secret-kenora...` | Fallback signing key | **Fails startup in production if default is used** |
| `S3_ENDPOINT` | `http://localhost:9000` | S3-compatible storage endpoint | MinIO, R2, or AWS S3 |
| `S3_BUCKET_NAME` | `kenora-artifacts` | Document and artifact bucket name | Required |

---

## 📜 Kenora Engineering Rules & Invariants

1. **Architecture Fidelity**: Follow established monorepo folder guidelines. No ad-hoc packages without review.
2. **Strict Multi-Tenancy**: Every database query, worker cycle, and search operation must be scoped to the active tenant via `TenantContext` or explicit foreign key constraints. Never trust raw client `x-tenant-id` headers.
3. **No Business Logic in Presentation Layers**: Controllers and React components only handle input delegation and UI rendering. Business logic lives strictly in domain services.
4. **Untrusted Data Boundary**: Treat all scraped external internet content as untrusted. Sanitize using `ExternalDataSanitizer` before passing to LLMs or vector indices.
5. **Declarative Security**: Use NestJS guards (`SessionAuthGuard`, `PermissionsGuard`, `RateLimitGuard`) and parameter decorators rather than imperative inline token parsing.
6. **Idempotent Background Jobs**: Background workers must enforce deduplication checks using content hashes before executing expensive pipelines.
7. **Source-Agnostic Principle**: External platforms (GitHub, RSS, APIs) are data providers, not hardcoded authorities. All content undergoes Bayesian corroboration.
8. **Structured Logging & Tracing**: Use Pino structured JSON logging with correlation IDs bound to `CorrelationContext`.
9. **Zero Plaintext Secrets**: Passwords are never stored in plaintext, never logged, and never returned in API response envelopes.
10. **Standard Error Envelopes**: All API errors must conform to RFC 7807 Problem Details via the global `GlobalExceptionFilter`.
