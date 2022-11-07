import './dotenv-config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import compression from 'compression'

const PORT = parseInt(process.env.PORT ?? '3000', 10)
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  })
  app.use(cookieParser())
  app.use(compression())
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(PORT)
}
bootstrap()
