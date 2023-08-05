import { Module } from '@nestjs/common';
import { PublicRemintService } from './public-remint.service';
import { PublicRemintController } from './public-remint.controller';
import { WalletWlModule } from 'src/wallet_wl/wallet_wl.module';
import { MagicEdenCollectionsModule } from 'src/magic-eden-collections/magic-eden-collections.module';
import { AuthorityRepository } from './repository/authority.repository.impl';
import { CandyMachineRepository } from './repository/candy-machine.pg.repository';
import { PublicRemintRepository } from './repository/public-remint.pg.repository';

@Module({
  controllers: [PublicRemintController],
  imports: [WalletWlModule, MagicEdenCollectionsModule],
  providers: [
    PublicRemintService,
    AuthorityRepository,
    CandyMachineRepository,
    PublicRemintRepository,
  ],
})
export class PublicRemintModule {}
