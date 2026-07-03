/// <reference types="vitest/globals" />
import { Test, TestingModule } from '@nestjs/testing'

import { AppController } from './app.controller'
import { AppService } from './app.service'

describe('AppController', () => {
  let app: AppController

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    app = module.get<AppController>(AppController)
  })

  describe('getHealth', () => {
    it('should return { status: "ok" }', () => {
      expect(app.getHealth()).toEqual({ status: 'ok' })
    })
  })
})
