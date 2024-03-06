import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from 'src/modules/auth/services/auth.service'
import { AuthRepository } from '../repositories/auth.repository'
import { UserService } from '../../user/services/user.service'
import { JwtService } from '@nestjs/jwt'
import { mikroOrmForFeature } from '../../orm/orm.module'
import { ModuleMocker } from 'jest-mock'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import 'src/dotenv-config'
import { PostgreSqlDriver } from '@mikro-orm/postgresql'
import { EntityManager } from '@mikro-orm/core'
import { mikroOrmForRootTest } from '../../../test/setup'

const moduleMocker = new ModuleMocker(global)

// jest.mock('@mikro-orm/nestjs', () => ({
//   MikroOrmModule: {
//     forRoot: jest.fn().mockImplementation(() => ({
//       // Mock implementation here
//       provide: 'MikroOrmModule',
//       useFactory: jest.fn(() => ({
//         em: {
//           find: jest.fn(),
//           findOne: jest.fn(),
//           persistAndFlush: jest.fn(),
//           removeAndFlush: jest.fn(),
//         },
//       })),
//     })),
//     forFeature: jest.fn(),
//   },
// }))
describe('AuthService', () => {
  let service: AuthService
  let em: EntityManager
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: EntityManager,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: '13',
            }),
          },
        },
      ],
      imports: [mikroOrmForRootTest, mikroOrmForFeature], // Import JwtModule
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('sum function should return correct result', async () => {
    // const j = jest.spyOn(em, 'findOne').mockResolvedValue({})
    const result = await service.sum(1, 2)
    expect(result).toBe(3)
  })
})
