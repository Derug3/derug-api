import { Module } from '@nestjs/common';
import { DiscordAuthService } from './discord-auth.service';
import { DiscordAuthController } from './discord-auth.controller';
import { UserDiscordRepository } from './repository/user-discord.repository';
import { Connection } from 'typeorm';
import { PgUserDiscordRepository } from './repository/user-discord.pg.repositroy';

@Module({
  controllers: [DiscordAuthController],
  providers: [
    DiscordAuthService,
    {
      provide: UserDiscordRepository,
      useFactory: (conn: Connection) =>
        conn.getCustomRepository(PgUserDiscordRepository),
      inject: [Connection],
    },
  ],
})
export class DiscordAuthModule {}
