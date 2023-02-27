import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function typeormConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: 'postgres',
    username: 'admin',
    password: 'admin',
    port: parseInt('5432'),
    database: 'fon-oglasnik',
    entities: ['dist/**/*.entity.js'],
    synchronize: true,
    autoLoadEntities: true,
  };
}
