import { PaginationArgs } from 'src/modules/common/dto/common.arg'
import { EntityRepository } from '@mikro-orm/core'

export class CommonRepository<Model extends object> extends EntityRepository<Model> {
  async paginate(args: PaginationArgs) {
    const page = args.page || 1
    const limit = args.limit || 20
    return 1
  }
}
