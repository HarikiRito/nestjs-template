import { Args, Query, Resolver } from '@nestjs/graphql';
import { Sample } from 'src/modules/sample/entities/sample.entity';

@Resolver(() => Sample)
export class SampleResolver {
  constructor() {}

  @Query(() => Boolean)
  async sample(@Args('id') id: number) {
    return false;
  }
}
