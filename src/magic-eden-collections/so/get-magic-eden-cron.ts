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
import { NftTrait } from 'src/tensor/entities/traits.entity';
import { v4 } from 'uuid';
import { TraitData } from 'src/tensor/entities/trait_data.entity';
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
    do {
      try {
        response = (await (
          await fetch(
            `${MAGIC_EDEN_API}${COLLECTIONS}?${OFFSET}=${offset}&${LIMIT}=${limit}`,
          )
        ).json()) as any;
        const flaggedCollections = await this.filterResponse(
          response,
          this.logger,
        );
        if (flaggedCollections && flaggedCollections.length > 0) {
          try {
            await this.collectionRepo.saveCollectionBatch(flaggedCollections);
          } catch (error) {
            console.log(error);
          }
        }
        this.logger.debug(
          `Saved batch of ${flaggedCollections.length} flagged NFTs`,
        );

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
        const flaggedCollections = await Promise.all(
          response
            .filter((c) => !!c.isFlagged)
            .map(async (ac) => {
              try {
                const traits: NftTrait[] = (
                  await this.tensorService.getTraitsTensor(ac.symbol)
                ).map((trait) => {
                  const nftTrait = new NftTrait();
                  nftTrait.collection = ac;
                  nftTrait.name = trait.name;
                  nftTrait.nftTraitId = v4();
                  const traits: TraitData[] = trait.values.map((t) => {
                    return {
                      image: t.image,
                      trait: nftTrait,
                      name: t.name,
                      percentage: t.percentage,
                      traitId: v4(),
                    };
                  });
                  nftTrait.traits = traits;
                  return nftTrait;
                });
              } catch (error) {
                this.logger.error(error.message);
                return ac;
              }
            }),
        );

        return flaggedCollections;
      }
      return [];
    } catch (error) {
      logger.error('Failed to save records to database:' + error.message);
    }
  }
}
