FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/shared/package.json packages/shared/tsconfig.json packages/shared/src packages/shared/src
COPY apps/api/package.json apps/api/tsconfig.json apps/api/nest-cli.json apps/api/ ./apps/api/
RUN corepack enable && pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app/apps/api
RUN pnpm prisma:generate
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/node_modules /app/node_modules
COPY --from=build /app/apps/api/dist /app/apps/api/dist
COPY --from=base /app/apps/api/package.json /app/apps/api/package.json
CMD ["node", "apps/api/dist/main.js"]
