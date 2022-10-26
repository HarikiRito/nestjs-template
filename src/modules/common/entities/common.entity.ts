import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Field, ID, ObjectType } from '@nestjs/graphql'
import { snowflake } from 'src/utils/common'

@ObjectType()
export class CommonEntity extends BaseEntity {
  @Field(() => ID)
  @Column('bigint', {
    primary: true,
    unsigned: true,
  })
  id: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date

  constructor(data: Record<string, unknown>) {
    super()
    Object.assign(this, { id: snowflake.nextId(), ...data })
  }
}
