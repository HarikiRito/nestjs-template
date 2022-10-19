import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Sample {
  @Field((type) => Int)
  id: number;

  name: string;
}
