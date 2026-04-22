# AI Agent Guide

## Scope

This workspace has three main areas:
- `backend/`: NestJS API with Prisma, Redis cache, and auth/items/users modules
- `frontend/`: Next.js App Router app (Next 16, React 19)
- `awesome-design-md/`: curated design references

Use links instead of duplicating docs. Key references:
- Backend source layout: [backend/src](backend/src)
- Frontend source layout: [frontend/app](frontend/app)
- Compose setup: [docker-compose.yml](docker-compose.yml)

## Quick Start

From workspace root:
- Install backend deps: `cd backend && npm install`
- Install frontend deps: `cd frontend && npm install`
- Run all services with Docker: `docker compose up --build`

Local app commands:
- Backend dev: `cd backend && npm run start:dev`
- Frontend dev: `cd frontend && npm run dev`

Validation before finishing changes:
- Backend lint/test: `cd backend && npm run lint && npm run test`
- Frontend lint: `cd frontend && npm run lint`

## Backend Conventions (NestJS)

Source of truth:
- Scripts: [backend/package.json](backend/package.json)
- App module boundaries: [backend/src/app.module.ts](backend/src/app.module.ts)
- Bootstrap behavior: [backend/src/main.ts](backend/src/main.ts)
- Prisma schema: [backend/prisma/schema.prisma](backend/prisma/schema.prisma)

Expected patterns:
- Keep feature logic inside module folders (`auth`, `users`, `items`) with controller/service/module split.
- Reuse shared cross-cutting utilities in [backend/src/common](backend/src/common) for guards, filters, pipes, and decorators.
- API is versioned and prefixed (`/api/v1/...`), and Swagger is mounted at `/api/docs`.

Database and env pitfalls:
- Prisma schema currently declares `sqlite`, while compose sets `DATABASE_URL` for MySQL. Align provider and migration workflow before changing data layer behavior.
- If schema changes, run `npm run prisma:generate` and applicable migration commands from [backend/package.json](backend/package.json).
- Do not rely on default JWT secret in production. See [backend/src/config/jwt.config.ts](backend/src/config/jwt.config.ts).

## Frontend Conventions (Next.js)

Source of truth:
- Scripts/dependencies: [frontend/package.json](frontend/package.json)
- Root layout and global styles entry: [frontend/app/layout.tsx](frontend/app/layout.tsx)
- Auth context: [frontend/src/context/AuthContext.tsx](frontend/src/context/AuthContext.tsx)
- Type/lint config: [frontend/tsconfig.json](frontend/tsconfig.json), [frontend/eslint.config.mjs](frontend/eslint.config.mjs)

Expected patterns:
- Use App Router conventions under [frontend/app](frontend/app).
- Use `@/*` imports per [frontend/tsconfig.json](frontend/tsconfig.json).
- Keep client-only auth logic inside client components/hooks; `AuthProvider` exists but is not wired into root layout by default.

Framework caveat:
- Next.js 16 has breaking changes. Confirm behavior against local docs in `frontend/node_modules/next/dist/docs/` when using framework APIs.

## Design Reference Workflow

- Browse curated design references under [awesome-design-md/design-md](awesome-design-md/design-md).
- Use [awesome-design-md/design-md/voltagent/README.md](awesome-design-md/design-md/voltagent/README.md) as a model for external design source links.
- Treat these as visual references; adapt to existing app architecture and shared components.

## Awesome Design MD Skill

Use `/awesome-design-md` to access curated DESIGN.md files for frontend implementation:
1. List available designs: `ls awesome-design-md/design-md/`
2. Copy a design reference: `cp awesome-design-md/design-md/[site]/README.md ./DESIGN.md`
3. Visit the actual DESIGN.md at: https://getdesign.md/[site]/design-md
4. Prompt agent: "Build me a page that looks like this" referencing the DESIGN.md