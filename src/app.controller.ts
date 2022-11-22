import { Controller, Get, OnModuleInit } from '@nestjs/common'
import { AppService } from './app.service'
import { runTemplate } from 'src/template'

@Controller()
export class AppController implements OnModuleInit {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }

  onModuleInit() {
    runTemplate()
  }
}
