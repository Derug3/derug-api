import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CollectionRepository } from './repository/collection.reposity';
import { GetFlaggedCollections } from './so/get-flagged-collections';
import { GetMagicEdenCron } from './so/get-magic-eden-cron';

@Injectable()
export class MagicEdenCollectionsService {
  private readonly getMagicEdenCron: GetMagicEdenCron;
  private readonly getFlaggedCollections: GetFlaggedCollections;
  constructor(private readonly collectionRepository: CollectionRepository) {
    this.getMagicEdenCron = new GetMagicEdenCron(collectionRepository);
    this.getFlaggedCollections = new GetFlaggedCollections(
      collectionRepository,
    );
  }
  @Cron('0 0 * * *')
  getMagicEdenFlaggedCollections() {
    this.getMagicEdenCron.execute();
  }

  getFlagged(pageNumber: number) {
    return this.getFlaggedCollections.execute(pageNumber);
  }
}
