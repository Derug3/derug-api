import { Module } from '@nestjs/common';
import { TwitterAuthService } from './twitter-auth.service';
import { TwitterAuthController } from './twitter-auth.controller';
import { UserTwitterRepository } from './repositry/user-twitter.repository';
import { Connection } from 'typeorm';
import { PgUserTwitterRepository } from './repositry/user-twitter.pg.repositroy';

@Module({
  controllers: [TwitterAuthController],
  providers: [
    TwitterAuthService,
    {
      provide: UserTwitterRepository,
      useFactory: (conn: Connection) =>
        conn.getCustomRepository(PgUserTwitterRepository),
      inject: [Connection],
    },
  ],
})
export class TwitterAuthModule {}
