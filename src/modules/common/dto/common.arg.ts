import { ArgsType, Field, InputType, Int } from '@nestjs/graphql';

@ArgsType()
@InputType()
export class PaginationArgs {
  @Field(() => Int, {
    defaultValue: 20,
  })
  limit?: number;

  @Field(() => Int, {
    defaultValue: 1,
  })
  page?: number;

  // sort?: SortInput;
  // filters?: FilterInput[];
}
