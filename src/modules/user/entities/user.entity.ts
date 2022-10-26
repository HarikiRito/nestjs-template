import { HideField, ObjectType } from '@nestjs/graphql'
import { CommonEntity } from 'src/modules/common/entities/common.entity'
import { BeforeInsert, Column, Entity } from 'typeorm'

@ObjectType()
@Entity({
  name: 'user',
})
export class UserEntity extends CommonEntity {
  @Column({ unique: true })
  username: string

  @Column({ nullable: true, unique: true })
  email?: string

  @HideField()
  @Column({ nullable: true })
  password?: string

  @HideField()
  @Column({ nullable: true })
  passwordSalt?: string
}
