import { CommonRepository } from 'src/modules/common/repositories/common.repository'
import { SampleEntity } from 'src/modules/sample/entities/sample.entity'
import { CustomRepository } from 'src/typeorm-ex/typeorm-ex.decorator'

@CustomRepository(SampleEntity)
export class SampleRepository extends CommonRepository<SampleEntity> {}
