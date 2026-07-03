import { ValidationPipe, BadRequestException } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from '@/app.module'
import { env } from '@/config/env.schema'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Enable validation pipes globally
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((e) => Object.values(e.constraints ?? {}))
        return new BadRequestException(messages.join('; '))
      },
    }),
  )

  // Enable CORS
  app.enableCors({
    credentials: true,
    origin: env.CORS_ORIGIN,
  })

  // Start server
  await app.listen(env.PORT)

  console.log(`Backend server running on: http://localhost:${env.PORT}`)
}

void bootstrap()
