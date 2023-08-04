import { Collection } from '../entity/collection.entity';
import { CollectionRepository } from '../repository/collection.reposity';

import {
  COLLECTIONS,
  LIMIT,
  MAGIC_EDEN_API,
  OFFSET,
} from 'src/utilities/constants';
import { Logger } from '@nestjs/common';
import { TensorService } from 'src/tensor/tensor.service';

export class GetMagicEdenCron {
  constructor(
    private readonly collectionRepo: CollectionRepository,
    private readonly tensorService: TensorService,
  ) {}

  private readonly logger = new Logger(GetMagicEdenCron.name);

  async execute() {
    let offset = 0;
    const limit = 500;
    let response: undefined | any;
    let shouldFetch = true;
    do {
      try {
        response = (await (
          await fetch(
            `${MAGIC_EDEN_API}${COLLECTIONS}?${OFFSET}=${offset}&${LIMIT}=${limit}`,
          )
        ).json()) as any;

        if (shouldFetch) {
          const filteredCollections = await this.filterResponse(
            response,
            this.logger,
          );
          await this.collectionRepo.saveCollectionBatch(filteredCollections);
        }

        shouldFetch = false;

        // if (filteredCollections && filteredCollections.length > 0) {
        //   try {
        //     await this.collectionRepo.saveCollectionBatch(filteredCollections);
        //   } catch (error) {
        //     console.log(error);
        //   }
        // }
        // this.logger.debug(
        //   `Saved batch of ${filteredCollections.length} flagged NFTs`,
        // );

        offset += response.length;
      } catch (error) {
        this.logger.error(
          'Failed to fetch batch of elements from ME api' + error,
        );
      }
    } while (response && response.length > 0);
    this.logger.log('Finished fetching rugged collections');
  }
  async filterResponse(response: Collection[], logger: Logger) {
    try {
      if (response.filter) {
        try {
          const flaggedCollections: Collection[] = await Promise.all(
            response.map(async (res, index) => {
              if (index === 0) {
              }
              return { ...res };
              // }
            }),
          );
          return flaggedCollections;
        } catch (error) {
          console.log(error);
        }
      }

      return [];
    } catch (error) {
      logger.error('Failed to save records to database:' + error.message);
    }
  }
}
