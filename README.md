# NestJS Template

A modern NestJS GraphQL API starter template with MikroORM and PostgreSQL.

## Stack

- **NestJS** + **GraphQL** (code-first)
- **MikroORM v7** with PostgreSQL
- **Vitest** (unit) + **Playwright** (e2e)
- **Biome** + **ESLint** for linting/formatting
- **pnpm** package manager

## Features

- **auth** — login / signup with JWT (access + refresh)
- **user** — user management
- **todo** — a minimal example feature to follow when adding your own

## Docs

- [Architecture](docs/architecture.md)
- [Conventions](docs/conventions.md)
- [How to add a new feature](docs/how-to-new-feature.md)

## Getting started

```bash
pnpm install
cp .env.example .env   # then fill in your values
pnpm start:dev
```
