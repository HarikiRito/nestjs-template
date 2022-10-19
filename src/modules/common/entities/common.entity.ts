import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID } from '@nestjs/graphql';
import { GraphNode } from 'src/modules/common/interfaces/common.interface';
import { snowflake } from 'src/utils/common';

export class CommonEntity extends BaseEntity implements GraphNode {
  @Field(() => ID)
  @Column('bigint', {
    primary: true,
    unsigned: true,
  })
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
  constructor(data: Record<string, unknown>) {
    super();
    Object.assign(this, { id: snowflake.nextId(), ...data });
  }
}
