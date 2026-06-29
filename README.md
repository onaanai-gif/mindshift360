# MINDSHIFT360 Business Growth Partner

Monorepo containing the frontend, backend, and infrastructure for the
MINDSHIFT360 Business Growth Partner platform.

## Structure

```
backend/    FastAPI service (Python, SQLAlchemy, PostgreSQL)
frontend/   Next.js application (React, TypeScript, Tailwind CSS)
docs/       Project documentation
docker-compose.yml   Local multi-service orchestration
```

## Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local frontend development outside Docker)
- Python 3.11+ (for local backend development outside Docker)

## Running with Docker

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend health check: http://localhost:8000/health
- PostgreSQL: localhost:5432

## Backend (local development)

```bash
cd backend
pip install -e ".[dev]"
cp .env.example .env
uvicorn app.main:app --reload
```

Run tests:

```bash
pytest
```

Lint and format:

```bash
ruff check .
black --check .
mypy app
```

## Frontend (local development)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Run tests:

```bash
npm test
```

Lint and format:

```bash
npm run lint
npm run format
```

## Environment Variables

See `backend/.env.example` and `frontend/.env.example` for the full list of
configurable environment variables for each service.

## Current Scope

This repository currently provides the foundational application skeleton:
project structure, configuration, logging, a health-check endpoint, and the
Docker-based development environment. Authentication, business logic,
database tables, and integrations are intentionally not yet implemented and
will be added incrementally.
