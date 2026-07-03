# Conventions

## Result Pattern (neverthrow)

- Use `ResultAsync.fromPromise(promise, errMapper)` to wrap async operations
- Check `.isErr()` as a type guard before accessing `.error`
- Check `.isOk()` or use `.isErr()` to narrow to `.value`
- Always pass `{ cause: result.error }` to preserve the original error

```typescript
import { ResultAsync } from 'neverthrow'
import { toError } from '@/utils/safeData'

const result = await ResultAsync.fromPromise(
  this.todoRepository.findOneOrThrow({ id }),
  toError,
)

if (result.isErr()) {
  throw new NotFoundException(`Todo with ID ${id} not found`, { cause: result.error })
}

return result.value
```

For multi-step async operations, extract the logic into a private async method:

```typescript
import { ResultAsync } from 'neverthrow'
import { toError } from '@/utils/safeData'

private async removeTodo(id: number): Promise<TodoEntity> {
  const todo = await this.todoRepository.findOneOrThrow({ id })
  await this.todoRepository.getEntityManager().remove(todo).flush()
  return todo
}

async remove(id: number) {
  const result = await ResultAsync.fromPromise(this.removeTodo(id), toError)

  if (result.isErr()) {
    throw new NotFoundException(`Todo with ID ${id} not found`, { cause: result.error })
  }

  return result.value
}
```

## BaseEntity Extension

- `BaseEntity` provides `id` (integer PK), `createdAt`, `updatedAt` — all auto-managed
- To expose inherited fields in GraphQL, re-declare them with `declare` + `@Field`
- Do **not** add `@Property` again — the decorator is already on `BaseEntity`

```typescript
import { Entity, Property } from '@mikro-orm/decorators/legacy'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { BaseEntity } from '@/common/entities/base.entity'

@Entity({ repository: () => MyRepository, tableName: 'my_table' })
@ObjectType()
export class MyEntity extends BaseEntity {
  @Field(() => ID)
  declare id: number

  @Field(() => Date)
  declare createdAt: Date

  @Field(() => Date)
  declare updatedAt: Date

  @Field()
  @Property()
  name!: string
}
```

## BaseRepository Usage

- Extend `BaseRepository<T>` and call `super(em, EntityClass)` in the constructor
- Available methods: `findOneOrThrow(where)`, `paginate(options)`
- `paginate` returns `{ items, total, page, limit, totalPages, hasNextPage, hasPreviousPage }`

```typescript
import type { EntityManager } from '@mikro-orm/core'
import { BaseRepository } from '@/common/repositories/base.repository'
import { MyEntity } from '@/features/my/entities/my.entity'

export class MyRepository extends BaseRepository<MyEntity> {
  constructor(em: EntityManager) {
    super(em, MyEntity)
  }
}
```

## Input Validation

- `@InputType()` for mutation inputs; `@ArgsType()` for query args
- Use class-validator decorators (`@IsString`, `@IsOptional`, `@MinLength`, `@MaxLength`, etc.)
- Use `PartialType(CreateXInput)` from `@nestjs/graphql` for update inputs

```typescript
import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

@InputType()
export class CreateTodoInput {
  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string
}
```

```typescript
import { InputType, PartialType } from '@nestjs/graphql'
import { CreateTodoInput } from '@/features/todo/inputs/createTodo.input'

@InputType()
export class UpdateTodoInput extends PartialType(CreateTodoInput) {}
```

## Query Args with Filtering

- For queries needing pagination + filtering, create a `<name>Query.args.ts` extending `PaginationArgs`
- Create a separate `<name>Filter.input.ts` with `@InputType()` for filter fields
- Use `@ValidateNested()` + `@Type(() => FilterInput)` on the filter field

```typescript
// src/features/todo/inputs/todoFilter.input.ts
import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsOptional } from 'class-validator'

@InputType()
export class TodoFilterInput {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  completed?: boolean
}
```

```typescript
// src/features/todo/inputs/todoQuery.args.ts
import { ArgsType, Field } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'

import { PaginationArgs } from '@/common/types/paginationArgs'
import { TodoFilterInput } from '@/features/todo/inputs/todoFilter.input'

@ArgsType()
export class TodoQueryArgs extends PaginationArgs {
  @Field(() => TodoFilterInput, { nullable: true })
  @IsOptional()
  @Type(() => TodoFilterInput)
  @ValidateNested()
  filter?: TodoFilterInput
}
```

## File Naming Conventions

- Entities: `<name>.entity.ts`
- Repositories: `<name>.repository.ts`
- Services: `<name>.service.ts`
- Resolvers: `<name>.resolver.ts`
- Input types: `create<Name>.input.ts`, `update<Name>.input.ts`, `<name>Query.args.ts`, `<name>Filter.input.ts`
- Paginated response types: `paginated-<name>.type.ts`
- Module: `<name>.module.ts`

## Feature Folder Structure

```
src/features/<name>/
├── entities/
│   └── <name>.entity.ts
├── inputs/
│   ├── create<Name>.input.ts
│   ├── update<Name>.input.ts
│   └── <name>Query.args.ts
├── repositories/
│   └── <name>.repository.ts
├── resolvers/
│   └── <name>.resolver.ts
├── services/
│   └── <name>.service.ts
├── types/
│   └── paginated-<name>.type.ts
└── <name>.module.ts
```

## Style Rules

- No semicolons (Biome enforced)
- Path alias `@/*` maps to `src/*`
- MikroORM decorators import from `@mikro-orm/decorators/legacy` (not `@mikro-orm/core`)
- MikroORM type imports (`EntityManager`, `FilterQuery`, etc.) from `@mikro-orm/core`
