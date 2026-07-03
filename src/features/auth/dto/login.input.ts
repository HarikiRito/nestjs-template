import { Field, InputType } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import { IsEmail, IsString, MinLength } from 'class-validator'

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  email!: string

  @Field()
  @IsString()
  @MinLength(8)
  password!: string
}
