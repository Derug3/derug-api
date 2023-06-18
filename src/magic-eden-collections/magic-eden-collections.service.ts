import { Get, Injectable, OnModuleInit } from '@nestjs/common';
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

@Injectable()
export class MagicEdenCollectionsService {
  private readonly getMagicEdenCron: GetMagicEdenCron;
  private readonly getFlaggedCollections: GetFlaggedCollections;
  private readonly getRandomCollections: GetRandomCollections;
  private readonly getByName: GetByName;
  private readonly getBySlug: GetSingleCollection;
  private readonly getAllCollections: GetAllCollections;
  constructor(private readonly collectionRepository: CollectionRepository) {
    this.getMagicEdenCron = new GetMagicEdenCron(collectionRepository);
    this.getFlaggedCollections = new GetFlaggedCollections(
      collectionRepository,
    );
    this.getRandomCollections = new GetRandomCollections(collectionRepository);
    this.getByName = new GetByName(collectionRepository);
    this.getBySlug = new GetSingleCollection(collectionRepository);
    this.getAllCollections = new GetAllCollections(collectionRepository);
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

  getSingleCollection(slug: string) {
    return this.getBySlug.execute(slug);
  }

  getAllCollectionsSlugs() {
    return this.getAllCollections.execute();
  }
}
