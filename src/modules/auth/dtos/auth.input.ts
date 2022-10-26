import { InputType } from '@nestjs/graphql'

@InputType()
export class AuthInput {
  id: number
}
