# Architecture Decisions

## Overview

The repository is a monorepo with two independently deployable services:
a FastAPI backend and a Next.js frontend, sharing no code, communicating
over HTTP.

## Backend

- **FastAPI** was chosen for its async support, automatic OpenAPI docs, and
  strong typing via Pydantic.
- **Clean architecture / module boundaries**: `app/core` holds cross-cutting
  concerns (configuration, logging), `app/api` holds HTTP route handlers,
  and `app/db` holds database session/engine setup. This separation keeps
  each module small and lets future features (business logic, models) slot
  into their own packages without entangling configuration or transport
  concerns.
- **Configuration** is centralized in `app/core/config.py` using
  `pydantic-settings`, so all environment variables are validated and typed
  in a single place rather than scattered `os.environ` calls.
- **SQLAlchemy** engine/session setup exists in `app/db/session.py` so the
  database connection is ready to use, but no models or tables are defined
  yet, per current scope.
- **Health endpoint** (`/health`) is a minimal liveness/readiness probe with
  no dependencies, so it remains reliable for container orchestration health
  checks even before business logic exists.

## Frontend

- **Next.js App Router** with TypeScript and Tailwind CSS gives a
  conventional, file-system-routed structure that scales cleanly as pages
  and components are added.
- Styling uses Tailwind utility classes directly; no component abstraction
  layer is introduced until there is more than one page, avoiding premature
  abstraction.

## Docker

- Each service has its own `Dockerfile` so they can be built, scaled, and
  deployed independently. A multi-stage build is used for the frontend to
  keep the production image free of build-time dependencies.
- `docker-compose.yml` at the repo root wires the three services (Postgres,
  backend, frontend) together for local development, with a Postgres health
  check gating backend startup.

## Testing

- Backend tests use `pytest` with FastAPI's `TestClient` for fast,
  in-process HTTP testing without a running server.
- Frontend tests use `Jest` and `React Testing Library`, configured via
  `next/jest` to automatically handle Next.js-specific transforms.

## Out of Scope (by design)

Authentication, registration, WhatsApp integration, AI features, database
tables, and business logic are intentionally excluded from this iteration to
keep the change set scoped to the requested foundational setup.
