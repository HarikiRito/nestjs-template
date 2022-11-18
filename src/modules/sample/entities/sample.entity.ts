import { ObjectType } from '@nestjs/graphql'
import { CommonEntity } from 'src/modules/common/entities/common.entity'
import { Entity } from 'typeorm'

@ObjectType()
@Entity({
  name: 'samples',
})
export class SampleEntity extends CommonEntity {}
