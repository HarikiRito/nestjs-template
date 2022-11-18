import { registerEnumType } from '@nestjs/graphql'

export enum Platform {
  Web = 'web',
  Mobile = 'mobile',
}

registerEnumType(Platform, {
  name: 'Platform',
})
