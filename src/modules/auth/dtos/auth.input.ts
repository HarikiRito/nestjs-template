import { InputType } from '@nestjs/graphql'
import { Platform } from 'src/modules/auth/dtos/auth.enum'

@InputType()
export class LoginInput {
  email: string
  password: string
  deviceId?: string
  platform: Platform = Platform.Web
}
