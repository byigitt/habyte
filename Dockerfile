# syntax=docker/dockerfile:1.7

# ─── deps ──────────────────────────────────────────────────────────────────────
# Sadece manifest + lockfile kopyalanıyor; kod değişiklikleri bu layer'ı bozmasın.
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ─── build ─────────────────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ─── runner ────────────────────────────────────────────────────────────────────
# output:"standalone" kullanılmıyor: Next 16.3.1 file-tracing'i @swc/helpers/esm'i
# atlıyor ve server.js MODULE_NOT_FOUND ile düşüyor. Bu yüzden tam node_modules
# ile `next start` çalıştırıyoruz.
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
RUN corepack enable

COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/.next ./.next
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/next.config.ts /app/tsconfig.json ./

USER node
EXPOSE 3000
CMD ["pnpm", "start"]
