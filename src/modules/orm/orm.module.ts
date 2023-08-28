import { Module } from '@nestjs/common'
import { MikroOrmModule } from '@mikro-orm/nestjs'

import { mikroOrmRoot } from '../../configs/db'
import { Sample } from '../sample/entities/sample.entity'
import { User } from '../user/entities/user.entity'
import { Auth } from '../auth/entities/auth.entity'

@Module({
  imports: [
    mikroOrmRoot,
    MikroOrmModule.forFeature({
      entities: [Sample, User, Auth],
    }),
  ],
  exports: [MikroOrmModule],
})
export class OrmModule {}
