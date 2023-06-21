import { Injectable } from '@nestjs/common';
import { WalletWlDto } from './dto/wallet_wl.dto';
import { WalletWlRepository } from './repository/wallet_wl.repository';

@Injectable()
export class WalletWlService {
  constructor(private readonly wlRepo: WalletWlRepository) {}

  getAllWhitelistsForDerug(derugAddress: string) {
    return this.wlRepo.getAllWhitelistsForDerug(derugAddress);
  }

  saveOrUpdateWhitelistConfig(wlDto: WalletWlDto) {
    const signedMessage = Buffer.from(wlDto.signedMessage, 'hex');
    console.log(signedMessage);

    return this.wlRepo.saveOrUpdateWalletWhitelist({
      derugAddress: wlDto.derugAddress,
      derugger: wlDto.derugger,
      wallets: wlDto.wallets,
      duration: wlDto.duration,
      wlType: wlDto.wlType,
    });
  }
}
