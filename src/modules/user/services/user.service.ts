import bcrypt from 'bcryptjs'
import { Injectable } from '@nestjs/common'
import { CreateUserInput } from 'src/modules/user/dtos/user.input'
import { InjectRepository } from '@mikro-orm/nestjs'
import { User } from '../entities/user.entity'
import { EntityRepository } from '@mikro-orm/core'
import { UserRepository } from '../repositories/user.repository'

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

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
    const user = this.userRepo.create({
      username: input.username,
      password: input.password,
      email: input.email,
      passwordSalt: salt,
    })
    return this.userRepo.upsert(user)
  }
}
