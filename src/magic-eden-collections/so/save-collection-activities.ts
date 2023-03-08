import {
  LISTINGS,
  ACTIVITY_TYPE_LIST,
  COLLECTIONS,
  LIMIT,
  MAGIC_EDEN_API,
  OFFSET,
} from 'src/utilities/constants';
import dayjs from 'dayjs';
import { CollectionActivities } from '../entity/collection-activities.entity';
import { CollectionActivitiesRepository } from '../repository/activities/activities.repository';
import { Logger } from '@nestjs/common';
import { CollectionRepository } from '../repository/collection.reposity';
import { Collection } from '../entity/collection.entity';

export class SaveCollectionActiviteis {
  private readonly logger = new Logger(SaveCollectionActiviteis.name);
  constructor(
    private readonly collectionActivitiesRepo: CollectionActivitiesRepository,
    private readonly collectionsRepository: CollectionRepository,
  ) {}

  async execute() {
    let response;
    let offset = 0;
    const limit = 20;
    const collections = await this.collectionsRepository.getAllCollections();
    for (const collection of collections) {
      offset = 0;
      do {
        try {
          response = await (
            await fetch(
              `${MAGIC_EDEN_API}/${COLLECTIONS}/${collection.symbol}${LISTINGS}?${OFFSET}=${offset}&${LIMIT}=${limit}`,
            )
          ).json();

          this.collectionActivitiesRepo.saveActivities(
            mapCollectionActivities(response, collection),
          );
          this.logger.verbose(
            `Saved ${response.length} activities for collection ${collection.symbol}`,
          );
        } catch (error) {
          this.logger.error('Failed to store activities:', error);
        }
        offset += limit;
      } while (response && response.length > 0);
      this.logger.log(
        `Finished storing activities for collection ${collection.symbol}`,
      );
    }
    this.logger.warn('Saved all batch of activities!');
  }
}

export const mapCollectionActivities = (
  data: any,
  collection: Collection,
): CollectionActivities[] => {
  const activities: CollectionActivities[] = [];

  data
    .filter((d) => d.type === ACTIVITY_TYPE_LIST)
    .forEach((d) => {
      activities.push({
        collection: collection,
        listedAt: 10,
        mint: d.tokenMint,
        price: d.price,
        seller: d.seller,
      });
    });

  return activities;
};
