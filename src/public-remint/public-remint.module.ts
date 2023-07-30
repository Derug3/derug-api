import { Module } from '@nestjs/common';
import { PublicRemintService } from './public-remint.service';
import { PublicRemintController } from './public-remint.controller';
import { Connection } from 'typeorm';
import { PublicRemintRepository } from './repository/public-remint.repository';
import { PgPublicRemint } from './repository/public-remint.pg.repository';
import { CandyMachineRepository } from './repository/candy-machine.repository';
import { CandyMachineDataPgRepository } from './repository/candy-machine.pg.repository';
import { WalletWl } from 'src/wallet_wl/entity/wallet_wl.entity';

@Module({
  controllers: [PublicRemintController],
  providers: [
    PublicRemintService,
    WalletWl,
    {
      provide: PublicRemintRepository,
      useFactory: (conn: Connection) =>
        conn.getCustomRepository(PgPublicRemint),
      inject: [Connection],
    },
    {
      provide: CandyMachineRepository,
      useFactory: (conn: Connection) =>
        conn.getCustomRepository(CandyMachineDataPgRepository),
      inject: [Connection],
    },
  ],
})
export class PublicRemintModule {}
