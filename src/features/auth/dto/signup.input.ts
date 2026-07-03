import { Field, InputType } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import { IsString, Matches, MinLength } from 'class-validator'

import { LoginInput } from './login.input'

@InputType()
export class SignupInput extends LoginInput {
  @Field()
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  })
  declare password: string

  @Field()
  @IsString()
  @MinLength(1)
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  name!: string
}
