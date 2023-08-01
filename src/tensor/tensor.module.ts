import { forwardRef, Module } from '@nestjs/common';
import { TensorService } from './tensor.service';
import { TensorController } from './tensor.controller';
import { MagicEdenCollectionsModule } from 'src/magic-eden-collections/magic-eden-collections.module';

import { NftTraitRepository } from './nft_trait.repository';

@Module({
  imports: [forwardRef(() => MagicEdenCollectionsModule)],
  controllers: [TensorController],
  providers: [TensorService, NftTraitRepository],
  exports: [TensorService],
})
export class TensorModule {}
