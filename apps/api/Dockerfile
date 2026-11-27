# ==============================================================================
# Kenora Platform API - Production Multi-Stage Dockerfile
# ==============================================================================

# --- Stage 1: Build & Prune ---
FROM node:22-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm@10.33.0

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/api ./apps/api
COPY packages ./packages

RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @kenora/api build

# --- Stage 2: Production Runtime ---
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

RUN addgroup --system --gid 1001 kenora && \
    adduser --system --uid 1001 kenora

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

USER kenora

EXPOSE 4000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:4000/api/v1/health/liveness || exit 1

CMD ["node", "apps/api/dist/main.js"]
