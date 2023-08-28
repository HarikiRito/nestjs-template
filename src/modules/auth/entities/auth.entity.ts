import { ObjectType } from '@nestjs/graphql'
import { CommonEntity } from 'src/modules/common/entities/common.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { UserEntity } from 'src/modules/user/entities/user.entity'

@ObjectType()
// @Entity({
//   // name: 'auths',
// })
export class AuthEntity extends CommonEntity {
  @Column('bigint')
  userId: string

  @Column({ nullable: true })
  deviceId?: string

  @Column()
  accessToken: string

  @Column()
  refreshToken: string

  @Column({ nullable: true })
  expiresAt?: Date

  @ManyToOne(() => UserEntity, (users) => users.id)
  @JoinColumn({ name: 'userId' })
  user: UserEntity
}
