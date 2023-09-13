import { Args, Query, Resolver } from '@nestjs/graphql'
import { SampleEntity } from 'src/modules/sample/entities/sample.entity'
import { SampleService } from 'src/modules/sample/services/sample.service'

@Resolver(() => SampleEntity)
export class SampleResolver {
  constructor(private readonly sampleService: SampleService) {}

  @Query(() => [SampleEntity])
  async sample(@Args('id') id: number) {
    return this.sampleService.findOne()
  }
}
