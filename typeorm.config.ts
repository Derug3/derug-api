import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function typeormConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: 'derug-db',
    username: 'dev',
    password: 'dev',
    port: parseInt('5432'),
    database: 'dev',
    entities: ['dist/**/*.entity.js'],
    synchronize: true,
    autoLoadEntities: true,
  };
}
