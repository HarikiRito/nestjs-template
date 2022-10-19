import { TypeOrmModule } from '@nestjs/typeorm';

export const dbRoot = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: 'sample.sqlite',
});
