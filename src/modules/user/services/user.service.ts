import bcrypt from 'bcryptjs'
import { Injectable } from '@nestjs/common'
import { UserRepository } from 'src/modules/user/repositories/user.repository'
import { CreateUserInput } from 'src/modules/user/dtos/user.input'

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async findByUsername(username: string) {
    return this.userRepo.findOneBy({
      username,
    })
  }
  async findById(id: string) {
    return this.userRepo.findOneBy({
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
    return this.userRepo.save(user)
  }
}
