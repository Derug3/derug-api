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

export class GetListings {
  private readonly logger = new Logger(GetListings.name);
  constructor(
    private readonly collectionActivitiesRepo: CollectionActivitiesRepository,
    private readonly collectionsRepository: CollectionRepository,
  ) {}

  async execute(symbol: string): Promise<CollectionActivities[]> {
    let response;
    let offset = 0;
    const limit = 20;
    const collection = await this.collectionsRepository.getBySlug(symbol);
    const listings: CollectionActivities[] = [];
    offset = 0;
    do {
      try {
        response = await (
          await fetch(
            `${MAGIC_EDEN_API}/${COLLECTIONS}/${symbol}${LISTINGS}?${OFFSET}=${offset}&${LIMIT}=${limit}`,
          )
        ).json();

        mapCollectionActivities(response, collection, listings);

        this.logger.verbose(
          `Saved ${response.length} activities for collection ${symbol}`,
        );
      } catch (error) {
        this.logger.error('Failed to store activities:', error);
      }
      offset += limit;
    } while (response && response.length > 0);
    return listings;
  }
}

export const mapCollectionActivities = (
  data: any,
  collection: Collection,
  listings: CollectionActivities[],
) => {
  data
    .filter((d) => d.type === ACTIVITY_TYPE_LIST)
    .forEach((d) => {
      listings.push({
        collection: collection,
        listedAt: 10,
        mint: d.tokenMint,
        price: d.price,
        seller: d.seller,
      });
    });
};
