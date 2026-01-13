# Main CRM

**Main CRM** es un CRM full-stack de nivel profesional, diseñado para 2026 y más allá.  
Arquitectura moderna, altamente modular, segura, escalable y preparada para integraciones, automatización avanzada y multitenancy.

Este proyecto apunta a ser **producto real**, no demo ni prototipo académico.

---

## Índice

- [Visión](#visión)
- [Principios de Diseño](#principios-de-diseño)
- [Funcionalidades](#funcionalidades)
- [Arquitectura General](#arquitectura-general)
- [Stack Tecnológico 2026](#stack-tecnológico-2026)
- [Estructura del Repositorio](#estructura-del-repositorio)
- [Modelo de Dominio](#modelo-de-dominio)
- [Roles y Permisos (RBAC)](#roles-y-permisos-rbac)
- [API](#api)
- [Autenticación y Seguridad](#autenticación-y-seguridad)
- [Auditoría y Trazabilidad](#auditoría-y-trazabilidad)
- [Automatizaciones](#automatizaciones)
- [Reportes y Analytics](#reportes-y-analytics)
- [Variables de Entorno](#variables-de-entorno)
- [Instalación](#instalación)
- [Ejecución en Desarrollo](#ejecución-en-desarrollo)
- [Migraciones y Seed](#migraciones-y-seed)
- [Observabilidad](#observabilidad)
- [Despliegue](#despliegue)
- [Roadmap](#roadmap)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)

---

## Visión

Centralizar y optimizar la gestión de clientes, operaciones y oportunidades en un único sistema:

- Información consistente y auditable
- Automatización de procesos
- Escalabilidad horizontal
- Integración sencilla con sistemas externos
- Experiencia de usuario clara y profesional

---

## Principios de Diseño

- **Domain-Driven Design (DDD)**
- **API-first**
- **Security by default**
- **Observabilidad desde el día uno**
- **Configuración > hardcode**
- **Escalable y desacoplado**
- **Preparado para multitenancy**

---

## Funcionalidades

### Núcleo CRM
- **Accounts**: empresas/organizaciones
- **Contacts**: personas asociadas a cuentas
- **Deals**: oportunidades con pipeline configurable
- **Pipelines & Stages**: embudos personalizables
- **Activities**: llamadas, reuniones, visitas, emails
- **Tasks**: tareas con prioridades y vencimientos
- **Notes**: notas internas
- **Attachments**: archivos asociados a cualquier entidad
- **Tags**: etiquetado transversal

### Operación
- Asignación por usuario o equipo
- Historial completo de cambios
- Búsqueda avanzada y filtros
- Exportación de datos

### Automatización
- Reglas por eventos
- Acciones automáticas
- Webhooks
- Jobs en background

---

## Arquitectura General

Arquitectura **modular, desacoplada y orientada a servicios**:

- Frontend SPA
- Backend API
- Workers asíncronos
- Base de datos relacional
- Cache + cola de mensajes
- Storage de archivos

Todo orquestado con Docker.

---

## Stack Tecnológico 2026

### Backend
- **Node.js 20+**
- **NestJS**
- **TypeScript**
- **PostgreSQL**
- **Prisma ORM**
- **Redis**
- **BullMQ**
- **OpenAPI 3.1**

### Frontend
- **Next.js (App Router)**
- **React 19**
- **TypeScript**
- **TanStack Query**
- **Server Components**
- **Tailwind CSS**

### Infraestructura
- **Docker / Docker Compose**
- **Nginx**
- **MinIO (S3 compatible)**
- **Prometheus + Grafana**
- **OpenTelemetry**

---

## Estructura del Repositorio

main-crm/
│
├── apps/
│   ├── api/                 # Backend NestJS
│   ├── web/                 # Frontend Next.js
│   └── worker/              # Jobs y automatizaciones
│
├── packages/
│   ├── shared/              # Tipos, enums, validaciones
│   ├── ui/                  # Componentes UI
│   └── config/              # Configuración común
│
├── infra/
│   ├── docker/
│   └── nginx/
│
├── docs/
└── README.md

---

## Modelo de Dominio

Entidades principales:

- users
- teams
- roles
- permissions
- accounts
- contacts
- deals
- pipelines
- stages
- activities
- tasks
- notes
- attachments
- tags
- audit_logs
- automation_rules

Todas las entidades:
- tienen timestamps
- soportan soft delete
- generan auditoría

---

## Roles y Permisos (RBAC)

Roles base:
- **Admin**
- **Manager**
- **User**
- **ReadOnly**

Permisos:
- read
- create
- update
- delete
- assign
- export

Control por:
- rol
- equipo
- ownership

---

## API

Base URL:

/api/v1

Ejemplos:

GET    /accounts
POST   /accounts
GET    /deals
PATCH  /deals/:id
GET    /reports/funnel
POST   /automations

Convenciones:
- JSON estándar
- paginación
- filtros
- versionado

---

## Autenticación y Seguridad

- JWT Access + Refresh
- Rotación de tokens
- Hash Argon2
- Rate limiting
- Protección CSRF
- Validación estricta de inputs
- Headers de seguridad

---

## Auditoría y Trazabilidad

Toda acción crítica se registra:
- usuario
- entidad
- acción
- valores previos y nuevos
- timestamp
- IP / user agent

---

## Automatizaciones

- Triggers por eventos
- Acciones encadenadas
- Jobs asíncronos
- Reintentos
- Logs de ejecución

Ejemplo:
> Al mover un deal a “Ganado” → crear tareas + notificar + webhook

---

## Reportes y Analytics

- Funnel de ventas
- Forecast
- Conversión por etapa
- Actividad por usuario
- Aging de oportunidades
- Export CSV / XLSX

---

## Variables de Entorno

### Backend (`apps/api/.env`)

NODE_ENV=development
PORT=4000

DATABASE_URL=postgresql://postgres:postgres@db:5432/maincrm
REDIS_URL=redis://redis:6379

JWT_ACCESS_SECRET=change_me
JWT_REFRESH_SECRET=change_me

S3_ENDPOINT=http://minio:9000
S3_ACCESS_KEY=minio
S3_SECRET_KEY=minio123
S3_BUCKET=main-crm

CORS_ORIGIN=http://localhost:3000

### Frontend (`apps/web/.env`)

NEXT_PUBLIC_API_URL=http://localhost:4000

---

## Instalación

Requisitos:
- Docker
- Docker Compose

Clonar:

git clone https://github.com/tu-org/main-crm.git
cd main-crm

---

## Ejecución en Desarrollo

docker compose up -d –build

Servicios:
- Web: http://localhost:3000
- API: http://localhost:4000

---

## Migraciones y Seed

npx prisma migrate deploy
npx prisma db seed

Incluye:
- Admin inicial
- Pipeline default
- Roles base

---

## Observabilidad

- Logs estructurados
- Métricas
- Tracing distribuido
- Health checks

---

## Despliegue

Opciones:
- VPS con Docker
- Kubernetes
- Cloud managed services

Checklist:
- Backups automáticos
- Secrets seguros
- Monitoreo activo

---

## Roadmap

### v0.1
- Core CRM
- Auth + RBAC
- Auditoría

### v0.2
- Automatizaciones
- Adjuntos
- Reportes

### v1.0
- Multitenancy
- Integraciones externas
- Dashboards avanzados

---

## Contribuciones

- Branch: `feat/*` o `fix/*`
- PR documentados
- Código tipado y testeado

---

## Licencia

MIT
