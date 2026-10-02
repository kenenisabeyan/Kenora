# Changelog

All notable changes to the Kenora project will be documented in this file.

## [0.1.0] - 2026-10-02

### Added

- **Monorepo Foundation (Task 001)**: pnpm workspace, Turborepo, TypeScript base config.
- **Web App (`apps/web`)**: Next.js 15 application shell with layout, environment status probe, error boundary, and loading state.
- **API App (`apps/api`)**: NestJS backend with modular structure, health module (`GET /health`), validation pipe, and Pino logger.
- **Worker App (`apps/workers`)**: Node.js background worker runtime daemon with health server probe.
- **Core Packages (`packages/*`)**: `@kenora/domain`, `@kenora/types`, `@kenora/config`, `@kenora/database`, `@kenora/events`, `@kenora/api-contracts`, `@kenora/security`, `@kenora/observability`, `@kenora/ai`, `@kenora/agents`, `@kenora/knowledge`, `@kenora/verification`, `@kenora/memory`, `@kenora/search`, `@kenora/source-adapters`, `@kenora/ui`.
- **Infrastructure**: Docker Compose (`PostgreSQL 16 + pgvector`, `Redis 7`, `NATS JetStream`, `MinIO`).
- **CI & Documentation**: GitHub Actions workflow and ADR-0001.
