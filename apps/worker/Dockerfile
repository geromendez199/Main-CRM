FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/tsconfig.json packages/shared/src packages/shared/src
COPY apps/worker/package.json apps/worker/tsconfig.json apps/worker/ ./apps/worker/
RUN corepack enable && pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app/apps/worker
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/node_modules /app/node_modules
COPY --from=build /app/apps/worker/dist /app/apps/worker/dist
COPY --from=base /app/apps/worker/package.json /app/apps/worker/package.json
CMD ["node", "apps/worker/dist/index.js"]
