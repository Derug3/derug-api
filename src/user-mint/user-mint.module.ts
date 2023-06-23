import { Module } from '@nestjs/common';
import { UserMintService } from './user-mint.service';
import { UserMintController } from './user-mint.controller';
import { UserMintRepository } from './repository/repository';
import { Connection } from 'typeorm';
import { PgUserMint } from './repository/pg.repository';

@Module({
  controllers: [UserMintController],
  providers: [
    UserMintService,
    {
      provide: UserMintRepository,
      useFactory: (conn: Connection) => conn.getCustomRepository(PgUserMint),
      inject: [Connection],
    },
  ],
})
export class UserMintModule {}
