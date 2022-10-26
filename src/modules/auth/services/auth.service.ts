import { Injectable } from '@nestjs/common'
import { AuthRepository } from 'src/modules/auth/repositories/auth.repository'

@Injectable()
export class AuthService {
  constructor(private readonly authRepo: AuthRepository) {}

  async findOne() {
    return this.authRepo.find()
  }
}
