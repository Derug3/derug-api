import { forwardRef, Module } from '@nestjs/common';
import { TensorService } from './tensor.service';
import { TensorController } from './tensor.controller';
import { MagicEdenCollectionsModule } from 'src/magic-eden-collections/magic-eden-collections.module';

import { NftTraitRepository } from './repository/nft_trait.repository';
import { Repository } from 'typeorm';
import { StatsRepository } from './repository/stats.repository';
import { ListingRepository } from './repository/listing.repository';

@Module({
  imports: [forwardRef(() => MagicEdenCollectionsModule)],
  controllers: [TensorController],
  providers: [
    TensorService,
    NftTraitRepository,
    StatsRepository,
    ListingRepository,
  ],
  exports: [TensorService],
})
export class TensorModule {}
