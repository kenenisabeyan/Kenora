# Contributing to Kenora

Thank you for contributing to Kenora.

## Development Workflow

1. Clone the repository and install dependencies:
   ```bash
   pnpm install
   ```
2. Start local infrastructure services (PostgreSQL, Redis, NATS, MinIO):
   ```bash
   docker-compose up -d
   ```
3. Run development servers:
   ```bash
   pnpm dev
   ```
4. Before submitting code, ensure all checks pass:
   ```bash
   pnpm type-check
   pnpm lint
   pnpm test
   pnpm build
   ```

## Engineering Rules
- Maintain strict modular boundaries (`apps/*` vs `packages/*`).
- Do not import database or framework code into `@kenora/domain`.
- Always sanitize external input using `@kenora/security`.
- Preserve tenant isolation across all service calls.
