import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from 'typeorm.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DerugFormModule } from './derug-form/derug-form.module';

@Module({
  imports: [
    DerugFormModule,
    TypeOrmModule.forRootAsync({
      useFactory: typeormConfig,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
