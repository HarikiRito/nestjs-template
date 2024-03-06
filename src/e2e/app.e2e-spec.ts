import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from 'src/app.module'
import 'src/dotenv-config'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { promise } from 'zod'
import { envVars } from '../config/envConfig'

describe('AppController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    // console.log('app.e2e-spec__16', envVars)

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        // MikroOrmModule.forRoot({
        //   driver: PostgreSqlDriver,
        //   connect: false,
        //   dbName: 'test',
        //   port: 65432,
        //   entities: [`./dist/**/entities/*`],
        //   entitiesTs: [`./src/**/entities/*`],
        // }),
      ],
    }).compile()
    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/ (GET)', () => {
    return request.default(app.getHttpServer()).get('/').expect(200).expect('Hello World!')
  })
})
