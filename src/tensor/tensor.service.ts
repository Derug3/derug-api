import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MagicEdenCollectionsService } from 'src/magic-eden-collections/magic-eden-collections.service';
import { Repository } from 'typeorm';
import { NftTrait, TraitData } from './entities/traits.entity';
import {
  getFloorPrice,
  getListings,
  getTensorCollectionData,
  recentActivities,
} from './so/tensor.graphql';
import { v4 } from 'uuid';

import { Cron } from '@nestjs/schedule';
import { NftTraitRepository } from './repository/nft_trait.repository';
import { ListingRepository } from './repository/listing.repository';
import { StatsRepository } from './repository/stats.repository';
import { Collection } from 'src/magic-eden-collections/entity/collection.entity';
@Injectable()
export class TensorService {
  slugs: string[];
  constructor(
    @Inject(forwardRef(() => MagicEdenCollectionsService))
    private readonly collectionService: MagicEdenCollectionsService,
    @InjectRepository(NftTraitRepository)
    private readonly traitsRepo: NftTraitRepository,
    @InjectRepository(ListingRepository)
    private readonly listingRepo: ListingRepository,
    @InjectRepository(StatsRepository)
    private readonly statsRepo: StatsRepository,
  ) {
    this.slugs = [];
  }
  logger = new Logger(TensorService.name);

  // @Cron('* * * * *')
  async getTensorCollectionData(slug: string) {
    const allSlugs = await this.collectionService.getAllCollectionsSlugs();
  }

  getTensorListings(slug: string, collection: Collection) {
    return getListings(slug, collection);
  }

  getTensorRecentActivities(slug: string) {
    return recentActivities(slug);
  }
}
