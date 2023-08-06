import {
  forwardRef,
  Get,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CollectionActivitiesRepository } from './repository/activities/activities.repository';
import { CollectionRepository } from './repository/collection.reposity';
import { GetByName } from './so/get-by-name';
import { GetFlaggedCollections } from './so/get-flagged-collections';
import { GetMagicEdenCron } from './so/get-magic-eden-cron';
import { GetRandomCollections } from './so/get-random-collections';
import { GetListings } from './so/get-collection-listings';
import { GetSingleCollection } from './so/get-single-collection';
import { GetAllCollections } from './so/get-all-collections';
import { TensorService } from 'src/tensor/tensor.service';
import { railwayUrl } from 'src/utilities/solana/utilities';
import { chunk } from '@metaplex-foundation/js';

@Injectable()
export class MagicEdenCollectionsService implements OnModuleInit {
  private readonly getMagicEdenCron: GetMagicEdenCron;
  private readonly getFlaggedCollections: GetFlaggedCollections;
  private readonly getRandomCollections: GetRandomCollections;
  private readonly getByName: GetByName;
  private readonly getBySlug: GetSingleCollection;

  private readonly getAllCollections: GetAllCollections;
  logger = new Logger(MagicEdenCollectionsService.name);
  constructor(
    private readonly collectionRepository: CollectionRepository,
    private readonly tensorService: TensorService,
  ) {
    this.getMagicEdenCron = new GetMagicEdenCron(
      collectionRepository,
      this.tensorService,
    );
    this.getFlaggedCollections = new GetFlaggedCollections(
      collectionRepository,
    );
    this.getRandomCollections = new GetRandomCollections(collectionRepository);
    this.getByName = new GetByName(collectionRepository);
    this.getBySlug = new GetSingleCollection(
      collectionRepository,
      tensorService,
    );
    this.getAllCollections = new GetAllCollections(collectionRepository);
  }
  async onModuleInit() {
    await this.fetchProdCollections();
  }

  getMagicEdenFlaggedCollections() {
    this.getMagicEdenCron.execute();
  }

  getFlagged(pageNumber: number) {
    return this.getFlaggedCollections.execute(pageNumber);
  }

  async getRandom() {
    const randomCollections = await this.getRandomCollections.execute();
    const filteredCollections = await Promise.all(
      randomCollections.filter(async (coll) => {
        await this.checkImageStatus(coll.image);
      }),
    );
    return filteredCollections;
  }

  getCollectionByName(name: string) {
    return this.getByName.execute(name);
  }

  getSingleCollection(slug: string) {
    return this.getBySlug.execute(slug);
  }

  getAllCollectionsSlugs() {
    return this.getAllCollections.execute();
  }

  async updateTensorSlug(slug: string, tensorSlug: string) {
    const updated = await this.collectionRepository.updateTensorSlug(
      slug,
      tensorSlug,
    );
    return updated;
  }

  async fetchProdCollections() {
    try {
      this.logger.verbose(`Started storing  collections in db!`);
      const allSlugs = await this.collectionRepository.getAllCollections();

      this.logger.log(`In db stored ${allSlugs.length} collections`);

      if (allSlugs.length === 0) {
        const collections: any[] = await (
          await fetch(`${railwayUrl}/magic-eden-collections/all`)
        ).json();

        const chunkedCollections = chunk(collections, 500);
        await Promise.all(
          chunkedCollections.map(async (c) => {
            await this.collectionRepository.saveCollectionBatch(c);
          }),
        );
        this.logger.verbose(`Stored collections in db!`);
      }
    } catch (error) {
      this.logger.error(`Failed to fetch`);
    }
  }

  getAllCollectionsData() {
    return this.collectionRepository.getAllCollectionsData();
  }

  async initCollectionDerug(symbol: string) {
    await this.collectionRepository.initCollectionDerug(symbol);
  }

  async checkImageStatus(url: string) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      } else if (response.status === 404) {
        return false;
      }
    } catch (error) {
      console.error('Error occurred while fetching the image:', error);
      return false;
    }
  }
}
