import { WalletWlDto } from '../dto/wallet_wl.dto';
import { WalletWl } from '../entity/wallet_wl.entity';

export abstract class WalletWlRepository {
  abstract getAllWhitelistsForDerug(serverId: string): Promise<WalletWl>;
  abstract saveOrUpdateWalletWhitelist(wlDto: WalletWl): Promise<WalletWl>;
}
