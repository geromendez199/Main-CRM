FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/tsconfig.json packages/shared/src packages/shared/src
COPY apps/web/package.json apps/web/tsconfig.json apps/web/next.config.mjs apps/web/tailwind.config.ts apps/web/postcss.config.cjs apps/web/next-env.d.ts apps/web/ ./apps/web/
RUN corepack enable && pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app/apps/web
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/node_modules /app/node_modules
COPY --from=build /app/apps/web/.next /app/apps/web/.next
COPY --from=base /app/apps/web/public /app/apps/web/public
COPY --from=base /app/apps/web/package.json /app/apps/web/package.json
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000", "-H", "0.0.0.0", "-d", "."]
