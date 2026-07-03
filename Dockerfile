# syntax=docker/dockerfile:1
FROM node:24-alpine AS base
RUN corepack enable pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm.json pnpm-workspace.yaml .npmrc ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM base AS production
WORKDIR /app
COPY --from=deps /app/package.json /app/pnpm-lock.yaml /app/pnpm.json /app/.npmrc /app/pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --prod --frozen-lockfile
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json /app/tsconfig.build.json ./
COPY scripts/migrate.js ./scripts/migrate.js
RUN mkdir -p /app/temp && chown -R node:node /app/node_modules /app/temp /app/src
EXPOSE 3000
USER node
CMD ["node", "dist/src/main"]
