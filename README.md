# Kenora - AI-Powered Professional Intelligence Platform

Kenora is a source-agnostic AI professional intelligence infrastructure designed to discover, ingest, normalize, verify, connect, and deliver actionable insights across fragmented information ecosystems.

---

## 🏛️ Monorepo Architecture (Phase 0)

Kenora is built as a high-performance TypeScript monorepo managed by **pnpm** workspaces and **Turborepo**.

```
kenora/
├── apps/
│   ├── web/          # Next.js 15 Web Application & Intelligence Dashboard
│   ├── api/          # NestJS Modular Platform API & Swagger OpenAPI Docs
│   └── workers/      # Node.js Idempotent Background Workers & Ingestion Daemon
│
├── packages/
│   ├── domain/       # Core Domain entities & interface contracts
│   ├── types/        # Shared DTOs, schemas, API responses, Pagination
│   ├── config/       # Environment parsing & validation with Zod
│   ├── database/     # Drizzle ORM PostgreSQL + pgvector schema & client
│   ├── events/       # Domain event topics & NATS JetStream event backbone
│   ├── api-contracts/# Shared Zod validation schemas for REST/OpenAPI
│   ├── security/     # Security primitives, tenant isolation & untrusted data boundaries
│   ├── observability/# Structured Pino logger & correlation context manager
│   ├── ai/           # Provider-agnostic LLM model gateway abstraction
│   ├── agents/       # Autonomous agent core specifications & task lifecycles
│   ├── knowledge/    # Ingestion, normalization, deduplication & claim extraction pipeline
│   ├── verification/ # Corroboration & contradiction verification engine
│   ├── memory/       # Episodic & long-term memory store abstractions
│   ├── search/       # Hybrid search engine contracts (lexical + semantic)
│   ├── source-adapters/ # Source adapter framework & platform connectors
│   └── ui/           # Accessible component system & design tokens
│
├── infrastructure/   # Docker, Terraform, Kubernetes, and Monitoring configs
├── database/         # Database migrations, seeds, and fixtures
├── docs/             # Architecture decision records & product specifications
├── tests/            # Integration, end-to-end, and contract tests
└── scripts/          # Developer tooling & health check scripts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 20.0.0`
- pnpm `>= 9.0.0`
- Docker & Docker Compose (for PostgreSQL + pgvector, Redis, NATS)

### 1. Installation

```bash
pnpm install
```

### 2. Infrastructure Setup

Spin up local PostgreSQL (with `pgvector`), Redis, NATS JetStream, and MinIO:

```bash
docker-compose up -d
```

### 3. Database Migrations

```bash
pnpm db:push
```

### 4. Running Development Servers

Start all applications in parallel mode:

```bash
pnpm dev
```

- **Web Application**: `http://localhost:3000`
- **NestJS API Platform**: `http://localhost:4000/api/v1`
- **OpenAPI / Swagger Docs**: `http://localhost:4000/docs`
- **Worker Health Probe**: `http://localhost:4001/health`

---

## 📜 Kenora Engineering Rules

1. **Do not invent architecture**: Follow established monorepo folder guidelines strictly.
2. **Do not introduce dependencies without justification**.
3. **Do not duplicate domain logic**: Shared types and contracts live in `@kenora/domain` and `@kenora/types`.
4. **Do not bypass established interfaces**.
5. **Do not put business logic inside controllers**.
6. **Do not put business logic inside React components**.
7. **Do not access the database directly from presentation layers**.
8. **Validate all external input**: Handled by Zod schemas in `@kenora/api-contracts`.
9. **Treat external content as untrusted data**: Sanitized via `@kenora/security`.
10. **Preserve tenant isolation**: Context bound via `TenantContext`.
11. **Never expose secrets**: Secrets managed strictly through validated environment configs.
12. **Use structured logging**: Standardized on Pino (`@kenora/observability`).
13. **Make background jobs idempotent**: Workers execute deduplicated idempotency checks.
14. **Source Agnostic Principle**: External platforms are information providers, not hardcoded authority.
