import { ObjectType } from '@nestjs/graphql'
import { CommonEntity } from 'src/modules/common/entities/common.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { UserEntity } from 'src/modules/user/entities/user.entity'

@ObjectType()
@Entity({
  name: 'samples',
})
export class SampleEntity extends CommonEntity {}
