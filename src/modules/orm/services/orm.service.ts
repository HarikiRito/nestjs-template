import { Injectable, OnModuleInit } from '@nestjs/common'
import { EntityManager, MikroORM } from '@mikro-orm/core'

@Injectable()
export class OrmService implements OnModuleInit {
  constructor(
    private readonly em: EntityManager,
    private readonly orm: MikroORM,
  ) {}

  async onModuleInit() {
    const generator = this.orm.getSchemaGenerator()

    // This will automatically update the database schema
    await generator.updateSchema({
      safe: true,
    })
  }
}
