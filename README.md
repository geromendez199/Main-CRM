# Main CRM

Main CRM is a production-ready, multi-tenant CRM foundation built with a modern, API-first stack. It includes a NestJS REST API, a Next.js web application, and a BullMQ worker for automations.

## Highlights

- **API-first** design with OpenAPI 3.1 docs.
- **Multi-tenant** schema with strict tenant scoping.
- **RBAC** with role + permission enforcement at controller and service layers.
- **Audit logging** on all create/update/delete/restore operations.
- **Automation** pipeline with BullMQ and a deal-won onboarding workflow.
- **Dockerized** infrastructure (Postgres, Redis, MinIO, Nginx).

## Repository Structure

```
apps/
  api/        # NestJS REST API
  web/        # Next.js App Router UI
  worker/     # BullMQ workers
packages/
  shared/     # Shared types, Zod schemas, enums
infra/
  nginx/      # Reverse proxy configuration
```

## Requirements

- Node.js >= 20
- pnpm >= 9
- Docker + Docker Compose

## Environment Variables

Copy `.env.example` to `.env` and adjust values as needed.

## Development

```bash
pnpm install
pnpm -r prisma:generate
pnpm -r dev
```

## Docker Compose

```bash
docker compose up -d --build
```

Services:
- Web: http://localhost:3000
- API: http://localhost:4000
- Docs: http://localhost:4000/docs
- Nginx: http://localhost:8080

## Database

```bash
pnpm --filter @maincrm/api prisma:migrate
pnpm --filter @maincrm/api prisma:seed
```

## Smoke Test (curl)

1) Login with seeded admin:
```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@maincrm.local","password":"ChangeMe123!"}'
```

2) Create an account:
```bash
curl -X POST http://localhost:4000/api/v1/accounts \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Acme Corp"}'
```

3) Create a deal (fetch pipeline + stage IDs first):
```bash
curl -X GET http://localhost:4000/api/v1/pipelines \
  -H "Authorization: Bearer <ACCESS_TOKEN>"

curl -X GET http://localhost:4000/api/v1/stages \
  -H "Authorization: Bearer <ACCESS_TOKEN>"

curl -X POST http://localhost:4000/api/v1/deals \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Enterprise Expansion","accountId":"<ACCOUNT_ID>","pipelineId":"<PIPELINE_ID>","stageId":"<STAGE_ID>"}'
```

4) Move deal to WON:
```bash
curl -X PUT http://localhost:4000/api/v1/deals/<DEAL_ID> \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"stageId":"<WON_STAGE_ID>"}'
```

5) Verify automation tasks created:
```bash
curl -X GET http://localhost:4000/api/v1/tasks \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

6) Check audit logs:
```bash
curl -X GET http://localhost:4000/api/v1/audit-logs \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

## API Documentation

- Swagger UI: `http://localhost:4000/docs`
- OpenAPI JSON: `http://localhost:4000/docs-json`

## Limitations

- The web UI currently uses static mock data instead of live API integration for MVP screens.
- File uploads to MinIO are stored as metadata only; direct upload endpoints are not implemented yet.
- RBAC scoping beyond tenant-level (team/ownership) is not yet enforced in services.

## License

MIT
