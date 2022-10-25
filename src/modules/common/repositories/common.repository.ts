import { Repository } from 'typeorm'
import { PaginationArgs } from 'src/modules/common/dto/common.arg'

export class CommonRepository<Model> extends Repository<Model> {
  async paginate(args: PaginationArgs) {
    const page = args.page || 1
    const limit = args.limit || 20
    return 1
  }
}
