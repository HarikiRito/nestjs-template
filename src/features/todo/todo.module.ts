import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Module } from '@nestjs/common'

import { TodoEntity } from '@/features/todo/entities/todo.entity'
import { TodoResolver } from '@/features/todo/resolvers/todo.resolver'
import { TodoService } from '@/features/todo/services/todo.service'

@Module({
  exports: [TodoService], // Export for use in other modules if needed
  imports: [MikroOrmModule.forFeature([TodoEntity])],
  providers: [TodoService, TodoResolver],
})
export class TodoModule {}
