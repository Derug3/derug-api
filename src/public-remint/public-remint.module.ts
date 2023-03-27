import { Module } from '@nestjs/common';
import { PublicRemintService } from './public-remint.service';
import { PublicRemintController } from './public-remint.controller';
import { Connection } from 'typeorm';
import { PublicRemintRepository } from './repository/public-remint.repository';
import { PgPublicRemint } from './repository/public-remint.pg.repository';

@Module({
  controllers: [PublicRemintController],
  providers: [
    PublicRemintService,
    {
      provide: PublicRemintRepository,
      useFactory: (conn: Connection) =>
        conn.getCustomRepository(PgPublicRemint),
      inject: [Connection],
    },
  ],
})
export class PublicRemintModule {}
