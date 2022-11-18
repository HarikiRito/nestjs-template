import { SetMetadata } from '@nestjs/common'

export const TYPEORM_EX_CUSTOM_REPOSITORY = 'TYPEORM_EX_CUSTOM_REPOSITORY'

export function CustomRepository(entity: new (data: unknown) => unknown): ClassDecorator {
  return SetMetadata(TYPEORM_EX_CUSTOM_REPOSITORY, entity)
}
