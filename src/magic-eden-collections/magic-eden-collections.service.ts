import { Get, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CollectionActivitiesRepository } from './repository/activities/activities.repository';
import { CollectionRepository } from './repository/collection.reposity';
import { GetByName } from './so/get-by-name';
import { GetFlaggedCollections } from './so/get-flagged-collections';
import { GetMagicEdenCron } from './so/get-magic-eden-cron';
import { GetRandomCollections } from './so/get-random-collections';
import { GetListings } from './so/get-collection-listings';
import { GetSingleCollection } from './so/get-single-collection';

@Injectable()
export class MagicEdenCollectionsService {
  private readonly getMagicEdenCron: GetMagicEdenCron;
  private readonly getFlaggedCollections: GetFlaggedCollections;
  private readonly getRandomCollections: GetRandomCollections;
  private readonly getByName: GetByName;
  private readonly getBySlug: GetSingleCollection;
  private readonly getListings: GetListings;
  constructor(
    private readonly collectionRepository: CollectionRepository,
    private readonly activitiesRepo: CollectionActivitiesRepository,
  ) {
    this.getMagicEdenCron = new GetMagicEdenCron(collectionRepository);
    this.getFlaggedCollections = new GetFlaggedCollections(
      collectionRepository,
    );
    this.getRandomCollections = new GetRandomCollections(collectionRepository);
    this.getByName = new GetByName(collectionRepository);
    this.getListings = new GetListings(activitiesRepo, collectionRepository);
    this.getBySlug = new GetSingleCollection(collectionRepository);
  }
  @Cron('0 0 * * *')
  getMagicEdenFlaggedCollections() {
    this.getMagicEdenCron.execute();
  }

  getFlagged(pageNumber: number) {
    return this.getFlaggedCollections.execute(pageNumber);
  }

  getRandom() {
    return this.getRandomCollections.execute();
  }

  getCollectionByName(name: string) {
    return this.getByName.execute(name);
  }

  getListedNfts(symbol: string) {
    this.getListings.execute(symbol);
  }
  getSingleCollection(slug: string) {
    return this.getBySlug.execute(slug);
  }
}
