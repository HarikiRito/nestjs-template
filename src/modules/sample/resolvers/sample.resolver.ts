import { Args, Query, Resolver } from '@nestjs/graphql'
import { Sample } from 'src/modules/sample/entities/sample.entity'
import { SampleService } from 'src/modules/sample/services/sample.service'

@Resolver(() => Sample)
export class SampleResolver {
  constructor(private readonly sampleService: SampleService) {}

  @Query(() => [Sample])
  async sample(@Args('id') id: number) {
    return this.sampleService.findOne()
  }
}
