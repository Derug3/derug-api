import { Module } from '@nestjs/common';
import { WalletWlService } from './wallet_wl.service';
import { WalletWlController } from './wallet_wl.controller';

@Module({
  controllers: [WalletWlController],
  providers: [WalletWlService]
})
export class WalletWlModule {}
