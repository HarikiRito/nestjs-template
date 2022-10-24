import { ObjectType } from '@nestjs/graphql'
import { CommonEntity } from 'src/modules/common/entities/common.entity'
import { Column, Entity } from 'typeorm'

@ObjectType()
@Entity({
  name: 'sample',
})
export class SampleEntity extends CommonEntity {
  @Column()
  name: string
}
