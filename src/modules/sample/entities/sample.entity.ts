import { ObjectType } from '@nestjs/graphql'
import { CommonEntity } from 'src/modules/common/entities/common.entity'
import { Entity } from '@mikro-orm/core'

@ObjectType()
@Entity({
  tableName: 'samples',
})
export class Sample extends CommonEntity {}
