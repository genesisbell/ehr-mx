# EHR-MX

Sistema de Expediente Clinico Electronico (Electronic Health Records) for Mexico, aligned with NOM-004-SSA3-2012 and NOM-024-SSA3-2012.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + React Hook Form + Zod
- **Backend**: NestJS + Prisma ORM
- **Database**: PostgreSQL 16
- **Auth**: Keycloak (OIDC) + NextAuth v4
- **Cache**: Redis 7
- **Monorepo**: npm workspaces + Turborepo

## Prerequisites

- Node.js >= 18
- Docker & Docker Compose
- npm >= 9

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd ehr-mx
npm install
```

### 2. Environment files

```bash
cp .env.example .env
cp apps/web/.env.local.example apps/web/.env.local
```

### 3. Start Docker services

```bash
docker compose up -d
```

This starts PostgreSQL, Redis, Keycloak, and Adminer.

### 4. Generate Prisma client and run migrations

```bash
npx --workspace=packages/database prisma generate
npx --workspace=packages/database prisma migrate dev
```

### 5. Start dev servers

**Both at once (Turborepo):**

```bash
npm run dev
```

**Or separately:**

```bash
# Terminal 1 — API (NestJS, port 3001)
npm run dev -w @ehr-mx/api

# Terminal 2 — Web (Next.js, port 3100)
npm run dev --workspace=apps/web
```

### 6. Stop everything

```bash
# Stop dev servers (Ctrl+C in the terminal running them), or kill by port:
lsof -ti :3001,:3100 | xargs kill

# Stop Docker services
docker compose down
```

## Dev URLs

| Service       | URL                          |
| ------------- | ---------------------------- |
| Web (Next.js) | http://localhost:3100         |
| API (NestJS)  | http://localhost:3001         |
| API Health    | http://localhost:3001/health  |
| Keycloak      | http://localhost:8080         |
| Adminer       | http://localhost:8081         |

## Test Users

| Username     | Password  | Role     |
| ------------ | --------- | -------- |
| `dev-medico` | `dev1234` | doctor   |
| `dev-admin`  | `dev1234` | admin    |

> **Note:** On a fresh setup (no existing Docker volumes), the doctor user will be created as `dev-doctor` per `realm-export.json`. Existing volumes retain the legacy username `dev-medico`.

## Project Structure

```
ehr-mx/
├── apps/
│   ├── api/          # NestJS backend (port 3001)
│   └── web/          # Next.js frontend (port 3100)
├── packages/
│   ├── database/     # Prisma schema & client
│   └── shared/       # Shared types, schemas, constants
├── docker/
│   ├── keycloak/     # Realm export for dev
│   └── postgres/     # Init scripts
├── docker-compose.yml
└── turbo.json
```

## Roles (RBAC)

| Role         | Description              |
| ------------ | ------------------------ |
| `ADMIN`      | System administrator     |
| `DOCTOR`     | Attending physician      |
| `NURSE`      | Nursing staff            |
| `RECEPTION`  | Front desk / admissions  |

## Legal Framework

- **NOM-004-SSA3-2012** — Expediente clinico
- **NOM-024-SSA3-2012** — Sistemas electronicos (SIRES)
- **LFPDPPP** — Ley Federal de Proteccion de Datos Personales en Posesion de los Particulares
