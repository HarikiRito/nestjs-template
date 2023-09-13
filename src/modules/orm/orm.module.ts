import { Module } from '@nestjs/common'
import { MikroOrmModule } from '@mikro-orm/nestjs'

import { SampleEntity } from '../sample/entities/sample.entity'
import { UserEntity } from '../user/entities/user.entity'
import { AuthEntity } from '../auth/entities/auth.entity'
import { mikroOrmRoot } from '../../mikro-orm.config'

@Module({
  imports: [
    mikroOrmRoot,
    MikroOrmModule.forFeature({
      entities: [SampleEntity, UserEntity, AuthEntity],
    }),
  ],
  exports: [MikroOrmModule],
})
export class OrmModule {}
