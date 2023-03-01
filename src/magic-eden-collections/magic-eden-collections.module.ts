import { Module } from '@nestjs/common';
import { MagicEdenCollectionsService } from './magic-eden-collections.service';
import { MagicEdenCollectionsController } from './magic-eden-collections.controller';

@Module({
  controllers: [MagicEdenCollectionsController],
  providers: [MagicEdenCollectionsService]
})
export class MagicEdenCollectionsModule {}
