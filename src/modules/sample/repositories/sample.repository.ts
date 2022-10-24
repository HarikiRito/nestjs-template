import { CommonRepository } from 'src/modules/common/repositories/common.repository'
import { SampleEntity } from 'src/modules/sample/entities/sample.entity'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SampleRepository extends CommonRepository<SampleEntity> {}
