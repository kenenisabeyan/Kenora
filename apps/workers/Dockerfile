# ==============================================================================
# Kenora Background Workers - Production Multi-Stage Dockerfile
# ==============================================================================

# --- Stage 1: Build ---
FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@10.33.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/workers ./apps/workers
COPY packages ./packages

RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @kenora/workers build

# --- Stage 2: Production Runner ---
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 kenora && \
    adduser --system --uid 1001 kenora

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/workers/package.json ./apps/workers/
COPY --from=builder /app/apps/workers/dist ./apps/workers/dist
COPY --from=builder /app/apps/workers/node_modules ./apps/workers/node_modules

USER kenora

CMD ["node", "apps/workers/dist/main.js"]
