# How to Add a New Feature

Walkthrough using a hypothetical `Post` feature (fields: `title` string, `content` text optional, `published` boolean default false).

---

## 1. Create the Entity

- Extend `BaseEntity`
- Decorate with `@Entity` (MikroORM) and `@ObjectType` (GraphQL)
- Use `declare` for inherited BaseEntity fields exposed via `@Field`
- Import MikroORM decorators from `@mikro-orm/decorators/legacy`

```typescript
// src/features/post/entities/post.entity.ts
import { Entity, Property } from '@mikro-orm/decorators/legacy'
import { Field, ID, ObjectType } from '@nestjs/graphql'

import { BaseEntity } from '@/common/entities/base.entity'
import { PostRepository } from '@/features/post/repositories/post.repository'

@Entity({
  repository: () => PostRepository,
  tableName: 'posts',
})
@ObjectType()
export class PostEntity extends BaseEntity {
  @Field({ nullable: true })
  @Property({ nullable: true, type: 'text' })
  content?: string

  @Field(() => Date)
  declare createdAt: Date

  @Field(() => ID)
  declare id: number

  @Field()
  @Property({ default: false })
  published!: boolean

  @Field()
  @Property()
  title!: string

  @Field(() => Date)
  declare updatedAt: Date
}
```

---

## 2. Create the Repository

- Extend `BaseRepository<PostEntity>`
- Pass `PostEntity` to `super`

```typescript
// src/features/post/repositories/post.repository.ts
import type { EntityManager } from '@mikro-orm/core'

import { BaseRepository } from '@/common/repositories/base.repository'
import { PostEntity } from '@/features/post/entities/post.entity'

export class PostRepository extends BaseRepository<PostEntity> {
  constructor(em: EntityManager) {
    super(em, PostEntity)
  }
}
```

---

## 3. Create Input Types

- `CreatePostInput` uses `@InputType` with class-validator decorators
- `UpdatePostInput` extends `PartialType(CreatePostInput)`

```typescript
// src/features/post/inputs/createPost.input.ts
import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

@InputType()
export class CreatePostInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(10000)
  content?: string

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  published?: boolean

  @Field()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string
}
```

```typescript
// src/features/post/inputs/updatePost.input.ts
import { InputType, PartialType } from '@nestjs/graphql'

import { CreatePostInput } from '@/features/post/inputs/createPost.input'

@InputType()
export class UpdatePostInput extends PartialType(CreatePostInput) {}
```

---

## 3b. Create Query Args (for paginated queries)

- Create `postQuery.args.ts` extending `PaginationArgs`
- Optionally include a filter input

```typescript
// src/features/post/inputs/postFilter.input.ts
import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsOptional } from 'class-validator'

@InputType()
export class PostFilterInput {
  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  published?: boolean
}
```

```typescript
// src/features/post/inputs/postQuery.args.ts
import { ArgsType, Field } from '@nestjs/graphql'
import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'

import { PaginationArgs } from '@/common/types/paginationArgs'
import { PostFilterInput } from '@/features/post/inputs/postFilter.input'

@ArgsType()
export class PostQueryArgs extends PaginationArgs {
  @Field(() => PostFilterInput, { nullable: true })
  @IsOptional()
  @Type(() => PostFilterInput)
  @ValidateNested()
  filter?: PostFilterInput
}
```

---

## 4. Create the Service

- Inject `PostRepository` via constructor
- Wrap all operations in `ResultAsync.fromPromise`
- Check `.isErr()` before accessing `.error`; access result with `.value`
- Always pass `{ cause: result.error }` when throwing to preserve the original error
- Throw `NotFoundException` when entity lookup fails

```typescript
// src/features/post/services/post.service.ts
import { RequiredEntityData } from '@mikro-orm/core'
import { Injectable, NotFoundException } from '@nestjs/common'
import { ResultAsync } from 'neverthrow'

import { PostEntity } from '@/features/post/entities/post.entity'
import { CreatePostInput } from '@/features/post/inputs/createPost.input'
import { UpdatePostInput } from '@/features/post/inputs/updatePost.input'
import { PostRepository } from '@/features/post/repositories/post.repository'
import { toError } from '@/utils/safeData'

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  private async createPost(input: CreatePostInput): Promise<PostEntity> {
    const post = this.postRepository.create({
      content: input.content,
      published: input.published ?? false,
      title: input.title,
    } as RequiredEntityData<PostEntity>)
    await this.postRepository.getEntityManager().persist(post).flush()
    return post
  }

  async create(input: CreatePostInput): Promise<PostEntity> {
    const result = await ResultAsync.fromPromise(
      this.createPost(input),
      toError,
    )

    if (result.isErr()) {
      throw new Error(`Failed to create post: ${result.error}`, { cause: result.error })
    }

    return result.value
  }

  async findAll(page = 1, limit = 20) {
    const result = await ResultAsync.fromPromise(
      this.postRepository.paginate({
        limit,
        orderBy: { createdAt: 'DESC' },
        page,
      }),
      toError,
    )

    if (result.isErr()) {
      throw new Error(`Failed to fetch posts: ${result.error}`, { cause: result.error })
    }

    return result.value
  }

  async findOne(id: number): Promise<PostEntity> {
    const result = await ResultAsync.fromPromise(
      this.postRepository.findOneOrThrow({ id }),
      toError,
    )

    if (result.isErr()) {
      throw new NotFoundException(`Post with ID ${id} not found`, { cause: result.error })
    }

    return result.value
  }

  private async removePost(id: number): Promise<PostEntity> {
    const post = await this.postRepository.findOneOrThrow({ id })
    await this.postRepository.getEntityManager().remove(post).flush()
    return post
  }

  async remove(id: number): Promise<PostEntity> {
    const result = await ResultAsync.fromPromise(this.removePost(id), toError)

    if (result.isErr()) {
      throw new NotFoundException(`Post with ID ${id} not found`, { cause: result.error })
    }

    return result.value
  }

  private async updatePost(id: number, input: UpdatePostInput): Promise<PostEntity> {
    const post = await this.postRepository.findOneOrThrow({ id })
    if (input.title !== undefined) post.title = input.title
    if (input.content !== undefined) post.content = input.content
    if (input.published !== undefined) post.published = input.published
    await this.postRepository.getEntityManager().flush()
    return post
  }

  async update(id: number, input: UpdatePostInput): Promise<PostEntity> {
    const result = await ResultAsync.fromPromise(this.updatePost(id, input), toError)

    if (result.isErr()) {
      throw new NotFoundException(`Post with ID ${id} not found`, { cause: result.error })
    }

    return result.value
  }
}
```

---

## 5. Create the Resolver

- Queries: `post` (by id), `posts` (paginated)
- Mutations: `createPost`, `updatePost`, `deletePost`
- Delegate entirely to the service

```typescript
// src/features/post/resolvers/post.resolver.ts
import { Injectable } from '@nestjs/common'
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql'

import { PostEntity } from '@/features/post/entities/post.entity'
import { CreatePostInput } from '@/features/post/inputs/createPost.input'
import { PostQueryArgs } from '@/features/post/inputs/postQuery.args'
import { UpdatePostInput } from '@/features/post/inputs/updatePost.input'
import { PostService } from '@/features/post/services/post.service'
import { PaginatedPosts } from '@/features/post/types/paginated-posts.type'

@Injectable()
@Resolver(() => PostEntity)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => PostEntity)
  async createPost(@Args('input') input: CreatePostInput): Promise<PostEntity> {
    return this.postService.create(input)
  }

  @Mutation(() => PostEntity)
  async deletePost(@Args('id', { type: () => Int }) id: number): Promise<PostEntity> {
    return this.postService.remove(id)
  }

  @Query(() => PostEntity, { nullable: true })
  async post(@Args('id', { type: () => Int }) id: number): Promise<null | PostEntity> {
    return this.postService.findOne(id)
  }

  @Query(() => PaginatedPosts)
  async posts(@Args() args: PostQueryArgs): Promise<PaginatedPosts> {
    return this.postService.findAll(args)
  }

  @Mutation(() => PostEntity)
  async updatePost(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdatePostInput,
  ): Promise<PostEntity> {
    return this.postService.update(id, input)
  }
}
```

You also need the paginated response type:

```typescript
// src/features/post/types/paginated-posts.type.ts
import { Field, Int, ObjectType } from '@nestjs/graphql'

import { PostEntity } from '@/features/post/entities/post.entity'

@ObjectType()
export class PaginatedPosts {
  @Field()
  hasNextPage!: boolean

  @Field()
  hasPreviousPage!: boolean

  @Field(() => [PostEntity])
  items!: PostEntity[]

  @Field(() => Int)
  limit!: number

  @Field(() => Int)
  page!: number

  @Field(() => Int)
  total!: number

  @Field(() => Int)
  totalPages!: number
}
```

---

## 6. Create the Module

- Register the entity with `MikroOrmModule.forFeature`
- Note: `PostRepository` is provided automatically via the entity's `repository` option — do not add it to `providers`

```typescript
// src/features/post/post.module.ts
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { PostEntity } from '@/features/post/entities/post.entity'
import { PostResolver } from '@/features/post/resolvers/post.resolver'
import { PostService } from '@/features/post/services/post.service'

@Module({
  exports: [PostService],
  imports: [MikroOrmModule.forFeature([PostEntity])],
  providers: [PostService, PostResolver],
})
export class PostModule {}
```

---

## 7. Register in AppModule

- Add `PostModule` to the `imports` array in `src/app.module.ts`

```typescript
// src/app.module.ts (excerpt)
import { PostModule } from '@/features/post/post.module'

@Module({
  imports: [
    // ... existing modules
    PostModule,
  ],
})
export class AppModule {}
```

---

## 8. Generate and Run Migration

```bash
npx mikro-orm migration:create
npx mikro-orm migration:up
```
