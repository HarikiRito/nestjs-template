import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { AuthRepository } from '../repositories/auth.repository'
import { UserService } from '../../user/services/user.service'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { UserRepository } from '../../user/repositories/user.repository'
import { OrmModule } from '../../orm/orm.module'
import { ModuleMocker } from 'jest-mock'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { SampleEntity } from '../../sample/entities/sample.entity'
import { UserEntity } from '../../user/entities/user.entity'
import { AuthEntity } from '../entities/auth.entity'
import { mikroOrmRoot } from '../../../mikro-orm.config'
import 'src/dotenv-config'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
const moduleMocker = new ModuleMocker(global)
describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        {
          provide: JwtService,
          useValue: moduleMocker.mocked(JwtService),
        },
      ],
      imports: [
        MikroOrmModule.forRoot({
          driver: PostgreSqlDriver,
          dbName: 'test',
          port: 65432,
          entities: [`./dist/**/entities/*`],
          entitiesTs: [`./src/**/entities/*`],
          host: 'localhost',
          user: 'postgres',
          password: 'postgres',
        }),
        MikroOrmModule.forFeature({
          entities: [SampleEntity, UserEntity, AuthEntity],
        }),

        AuthRepository,
      ], // Import JwtModule
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
