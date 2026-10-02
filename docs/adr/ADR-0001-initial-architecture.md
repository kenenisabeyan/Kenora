# ADR-0001: Kenora Initial Foundation Architecture

- **Status**: Accepted
- **Date**: 2026-10-02
- **Deciders**: Kenora Engineering Team

## Context

Kenora is an AI-powered Professional Intelligence Infrastructure designed to discover, ingest, normalize, verify, connect, understand, assess, personalize, and transform fragmented professional information into actionable professional intelligence.

The architecture must support long-term horizontal scaling, multi-tenancy, provider-agnostic AI model gateways, and a source-agnostic knowledge pipeline. However, deploying polyglot microservices and specialized persistence stores (Neo4j, OpenSearch, Kafka, Kubernetes) on Day 1 introduces unnecessary operational complexity, slow iteration velocity, and high initial costs.

## Decision

We establish a **modular monorepo foundation (Phase 0)** using:

1. **Monorepo**: TypeScript, pnpm workspaces, and Turborepo.
2. **Web Layer**: Next.js App Router for frontend UI and client shell.
3. **API Layer**: NestJS for modular REST & OpenAPI endpoints.
4. **Worker Layer**: Node.js background workers with BullMQ for job queues.
5. **Primary Database**: PostgreSQL with `pgvector` extension for relational data, tenancy, transactional state, and initial vector embeddings.
6. **ORM**: Drizzle ORM for type-safe database queries and migrations.
7. **Cache & Queues**: Redis for transient state, caching, rate limiting, and BullMQ queue storage.
8. **Event Backbone**: NATS JetStream for asynchronous domain event streaming.
9. **Object Storage**: S3-compatible storage (LocalStack / MinIO) for raw documents and media artifacts.

## Rationale

- **Lean & Progressive**: PostgreSQL + `pgvector` + Redis + NATS handles transactions, relational graphs, vector search, caching, and event streaming under moderate to high workloads.
- **Source Agnostic**: Core business logic is isolated in `@kenora/domain` and `@kenora/knowledge`. Source adapters interact strictly through `@kenora/source-adapters/core` interfaces.
- **Tenant Isolation**: Multi-tenancy is enforced at the database and application boundary with explicit tenant ownership.
- **Security Boundary**: External internet content is treated as untrusted data (`ExternalDataSanitizer`). Prompt injection and script execution from scraped data are explicitly prevented.

## Consequences

- We defer specialized databases (Neo4j for graph, OpenSearch for full-text search) until real workload benchmarks justify them.
- Horizontal scaling will be achieved progressively: PostgreSQL → specialized persistence, Redis → distributed cache cluster, Docker Compose → Kubernetes when operational scale requires it.
