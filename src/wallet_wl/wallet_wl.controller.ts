import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WalletWlDto } from './dto/wallet_wl.dto';
import { WalletWlService } from './wallet_wl.service';

@Controller('wallet-wl')
export class WalletWlController {
  constructor(private readonly walletWlService: WalletWlService) {}

  @Get('all/:derugAddress')
  getAllWhitelistsForDerug(@Param('derugAddress') derugAddress: string) {
    return this.walletWlService.getAllWhitelistsForDerug(derugAddress);
  }

  @Post('/store-wallets')
  storeWlWallets(@Body() wlDto: WalletWlDto) {
    return this.walletWlService.saveOrUpdateWhitelistConfig(wlDto);
  }
}
