import { Module } from '@nestjs/common';
import { WalletWlService } from './wallet_wl.service';
import { WalletWlController } from './wallet_wl.controller';
import { WalletWlRepository } from './repository/wallet_wl.repository';
import { PgRepositoryWalletWl } from './repository/pg.repository';
import { Connection } from 'typeorm';

@Module({
  controllers: [WalletWlController],
  providers: [
    WalletWlService,
    {
      provide: WalletWlRepository,
      useFactory: (conn: Connection) =>
        conn.getCustomRepository(PgRepositoryWalletWl),
      inject: [Connection],
    },
  ],
  exports: [WalletWlService],
})
export class WalletWlModule {}
