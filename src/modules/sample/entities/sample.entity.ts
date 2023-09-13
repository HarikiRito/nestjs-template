import { ObjectType } from '@nestjs/graphql'
import { CommonEntity } from 'src/modules/common/entities/common.entity'
import { Entity } from '@mikro-orm/core'
import { SampleRepository } from '../repositories/sample.repository'

@ObjectType()
@Entity({
  tableName: 'samples',
  repository: () => SampleRepository,
})
export class Sample extends CommonEntity {}
