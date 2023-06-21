import { AbstractRepository, EntityRepository } from 'typeorm';
import { WalletWlDto } from '../dto/wallet_wl.dto';
import { WalletWl } from '../entity/wallet_wl.entity';
import { WalletWlRepository } from './wallet_wl.repository';

@EntityRepository(WalletWl)
export class PgRepositoryWalletWl
  extends AbstractRepository<WalletWl>
  implements WalletWlRepository
{
  getAllWhitelistsForDerug(derugAddress: string): Promise<WalletWl> {
    return this.repository.findOne({ where: { derugAddress } });
  }
  saveOrUpdateWalletWhitelist(wlDto: WalletWl): Promise<WalletWl> {
    return this.repository.save(wlDto);
  }
}
