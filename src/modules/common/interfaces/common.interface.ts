import { Field, ID, InterfaceType } from '@nestjs/graphql';

@InterfaceType({
  description: 'Node',
})
export abstract class GraphNode {
  @Field(() => ID)
  id: string;
}
