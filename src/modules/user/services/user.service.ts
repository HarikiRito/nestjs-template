import bcrypt from 'bcryptjs'
import { Injectable } from '@nestjs/common'
import { CreateUserInput } from 'src/modules/user/dtos/user.input'
import { InjectRepository } from '@mikro-orm/nestjs'
import { User } from '../entities/user.entity'
import { EntityRepository, EntityManager } from '@mikro-orm/core'
import { UserRepository } from '../repositories/user.repository'
import { goAwaited } from '../../../utils/common'
import { GraphQLError } from 'graphql/error'

@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly em: EntityManager,
  ) {}

  async findByUsername(username: string) {
    return this.userRepo.findOne({
      username,
    })
  }
  async findById(id: string) {
    return this.userRepo.findOne({
      id,
    })
  }

  async createUser(input: CreateUserInput) {
    const salt = bcrypt.genSaltSync()
    input.password = bcrypt.hashSync(input.password, salt)

    const user = this.em.assign(new User(), {
      username: input.username,
      password: input.password,
      email: input.email,
      passwordSalt: salt,
    })

    const existingUser = await this.findByUsername(input.username)

    if (existingUser) {
      throw new GraphQLError('Username already exists')
    }

    const [err, result] = await goAwaited(() => this.userRepo.upsert(user))

    if (err) {
      throw new GraphQLError(err.message)
    }

    return result
  }
}
