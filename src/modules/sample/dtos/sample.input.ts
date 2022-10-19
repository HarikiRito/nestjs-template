import { InputType } from '@nestjs/graphql';

@InputType()
export class SampleInput {
  id: number;
}
