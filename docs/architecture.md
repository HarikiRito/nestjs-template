# Architecture

## Tech Stack

- NestJS `^11.1.17`
- MikroORM `^7.0.5` — PostgreSQL driver (`@mikro-orm/postgresql`)
- Apollo Server `^5.5.0` via `@nestjs/apollo ^13.2.4`
- GraphQL `^16.13.2` — code-first (schema generated in memory)
- Vitest `^4.1.1`

## Module / Layer Diagram

```
AppModule
├── AppConfigModule       (global config via AppConfigService)
├── DatabaseModule        (MikroORM connection)
├── CommonModule          (guards, decorators, base entities/repos)
├── GraphQLModule         (ApolloDriver, code-first, autoSchemaFile)
└── Feature Modules
    ├── TodoModule
    └── UserModule
```

```
HTTP/GraphQL request
       │
  JwtAuthGuard (global APP_GUARD)
       │
  Resolver  →  Service  →  Repository  →  MikroORM EntityManager  →  PostgreSQL
```

## Feature Module Anatomy

Layers in dependency order:

1. `entities/` — MikroORM entity + GraphQL `@ObjectType`
2. `repositories/` — extends `BaseRepository<T>`
3. `inputs/` — `@InputType` / `@ArgsType` classes with class-validator
4. `types/` — `@ObjectType` response shapes (e.g. paginated wrappers)
5. `services/` — business logic, uses `guardAsync` + `findOneOrThrow`
6. `resolvers/` — `@Resolver`, delegates entirely to service
7. `<name>.module.ts` — wires `MikroOrmModule.forFeature`, providers, exports

## Auth Model

- `JwtAuthGuard` is registered globally via `APP_GUARD` in `AppModule`
- By default all routes are **public**
- Apply `@Auth()` to a resolver method to require a valid JWT
- Use `@CurrentUser()` as a param decorator to get the authenticated user (`{ id, email, name?, role? }`)

## Config Pattern

- `AppConfigModule` is global — import it once in `AppModule`
- Inject `AppConfigService` directly in any provider without importing `AppConfigModule` again
