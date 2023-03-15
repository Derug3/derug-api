import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export function typeormConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: process.env.POSTGRES_DB,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: process.env.DB_NAME,
    entities: [join(__dirname, '/**/*.entity{.ts,.js}')],
    ssl: true,
    synchronize: true,
    autoLoadEntities: true,
  };
}
