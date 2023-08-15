import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
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
import { CronDataRepository } from './repository/cron_data.repository';
import { CronData } from './entities/cron_data.entity';
import { NotFoundError } from 'rxjs';
@Injectable()
export class TensorService implements OnModuleInit {
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
    @InjectRepository(CronDataRepository)
    private readonly cronDataRepo: CronDataRepository,
  ) {
    this.slugs = [];
  }
  async onModuleInit() {
    await this.initCronData();
  }
  logger = new Logger(TensorService.name);

  async getTensorCollectionData(slug: string) {
    try {
      const allSlugs = await this.collectionService.getAllCollectionsSlugs();
      const cronData = await this.cronDataRepo.getCronData();
      this.logger.log(
        `Got cron data with ${cronData.slugs.length} stored slugs!`,
      );
      const filteredCollections = allSlugs
        .filter((collection) => !cronData.slugs.includes(collection.symbol))
        .slice(0, 8);
      const newSlugs: string[] = [];
      await Promise.all(
        filteredCollections.map(async (collection) => {
          try {
            const data = await getTensorCollectionData(
              collection.symbol,
              collection,
            );
            if (!data) return;

            if (data?.stats) {
              await this.statsRepo.save(data.stats);
            }
            if (data?.traits) await this.traitsRepo.save(data.traits);
            const listings = await this.getTensorListings(
              data.tensorSlug,
              collection,
            );
            if (listings) {
              await this.listingRepo.save(listings);
            }
            newSlugs.push(collection.symbol);
          } catch (error) {
            console.log(error);
            // this.logger.error(
            //   `Failed in collections mapping for symbol ${collection.symbol} with error ${error.message}`,
            // );
          }
        }),
      );
      this.logger.log(`Stored stats for ${newSlugs.length} collections`);
      await this.cronDataRepo.appendSlugs(newSlugs);
    } catch (error) {
      this.logger.error(`Failed in tensor cron: ${error.message}`);
    }
  }

  async storeStats(slug: string, collection?: Collection) {
    if (!collection) {
      collection = await this.collectionService.getSingleCollection(slug);
    }
    if (!collection) {
      throw new NotFoundException('Colelction not found!');
    }
    try {
      const data = await getTensorCollectionData(collection.symbol, collection);
      const listings = await this.getTensorListings(
        data.tensorSlug,
        collection,
      );
      await this.listingRepo.save(listings);
      await this.statsRepo.save(data.stats);
      await this.traitsRepo.save(data.traits);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  getTensorListings(slug: string, collection: Collection) {
    return getListings(slug, collection);
  }
  getTensorRecentActivities(slug: string) {
    return recentActivities(slug);
  }

  getSlugs() {
    return this.statsRepo
      .createQueryBuilder('stats')
      .orderBy('RANDOM()')
      .take(50)
      .getMany();
  }

  async initCronData() {
    try {
      const cronData = await this.cronDataRepo.getCronData();
      if (!cronData) {
        const cronData = new CronData();
        cronData.id = v4();
        cronData.slugs = [];

        await this.cronDataRepo.saveCronData(cronData);
        this.logger.log(`Stored cron data with id ${cronData.id}`);
      }
    } catch (error) {
      this.logger.error(`Failed storing cron data:${error.message}`);
    }
  }

  getStats(slug: string) {
    return this.statsRepo.findOne({ where: { symbol: slug } });
  }

  getListings(slug: string) {
    return this.listingRepo.find({ where: { collection: { symbol: slug } } });
  }
}
