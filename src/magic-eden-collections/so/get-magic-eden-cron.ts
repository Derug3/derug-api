import { Collection } from '../entity/collection.entity';
import { CollectionRepository } from '../repository/collection.reposity';

import {
  COLLECTIONS,
  LIMIT,
  MAGIC_EDEN_API,
  OFFSET,
} from 'src/utilities/constants';
import { Logger } from '@nestjs/common';
export class GetMagicEdenCron {
  constructor(private readonly collectionRepo: CollectionRepository) {}

  private readonly logger = new Logger(GetMagicEdenCron.name);

  async execute() {
    let offset = 0;
    const limit = 500;
    let response: undefined | any;
    do {
      try {
        response = (await (
          await fetch(
            `${MAGIC_EDEN_API}${COLLECTIONS}?${OFFSET}=${offset}&${LIMIT}=${limit}`,
          )
        ).json()) as any;
        const flaggedCollections = await filterResponse(response, this.logger);
        this.collectionRepo.saveCollectionBatch(flaggedCollections);
        this.logger.debug(
          `Saved batch of ${flaggedCollections.length} flagged NFTs`,
        );
        offset += flaggedCollections.length;
      } catch (error) {
        this.logger.error(
          'Failed to fetch batch of elements from ME api' + error.message,
        );
      }
    } while (response || response.length > 0);
  }
}

async function filterResponse(response: Collection[], logger: Logger) {
  try {
    const flaggedCollections = response.filter((c) => !!c.isFlagged);
    return flaggedCollections;
  } catch (error) {
    logger.error('Failed to save records to database:' + error.message);
  }
}
