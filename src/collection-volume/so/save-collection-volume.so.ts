import { Logger } from '@nestjs/common';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { plainToClass } from 'class-transformer';
import { gql } from 'graphql-request';
import { Collection } from 'src/magic-eden-collections/entity/collection.entity';
import { MagicEdenCollectionsService } from 'src/magic-eden-collections/magic-eden-collections.service';
import { GetAllCollections } from 'src/magic-eden-collections/so/get-all-collections';
import { FP_QUERY } from 'src/tensor/so/query';
import { graphQLClient } from 'src/utilities/solana/utilities';
import { CollectionVolume } from '../entity/collection-volume.entity';
import { CollectionVolumeRepository } from '../repository/collection-volume.repository';

export class SaveCollectionVolume {
  constructor(
    private readonly collectionVolumeRepo: CollectionVolumeRepository,
    private readonly collectionService: MagicEdenCollectionsService,
  ) {}

  private logger = new Logger(SaveCollectionVolume.name);

  async execute() {
    try {
      const collectionsVolumes: CollectionVolume[] = [];
      const collectionsSlugs =
        await this.collectionService.getAllCollectionsSlugs();
      this.logger.log(`Got ${collectionsSlugs.length} collections`);
      for (const collection of collectionsSlugs) {
        try {
          const response = (await graphQLClient.request(FP_QUERY, {
            slug: collection.symbol,
          })) as any;
          const mappedCollectionVolume = this.mapResponse(
            response.instrumentTV2.statsOverall,
            collection,
          );

          collectionsVolumes.push(mappedCollectionVolume);
          this.logger.log(`Saved volumes for collection ${collection.symbol}`);
          await this.collectionVolumeRepo.saveCollectionVolume([
            mappedCollectionVolume,
          ]);
        } catch (error) {
          this.logger.error(error);
        }
      }
      // await this.collectionVolumeRepo.saveCollectionVolume(collectionsVolumes);
    } catch (error) {
      this.logger.error(error);
    }
  }

  SOL_LAMPORT = 'SOL_LAMPORT';

  mapResponse(response: any, collection: Collection) {
    if (response.priceUnit === this.SOL_LAMPORT) {
      Object.keys(response).forEach((key) => {
        if (key != 'numMints') {
          response[key] = +(response[key] / LAMPORTS_PER_SOL);
        }
      });
    }

    const collectionVolume = new CollectionVolume();

    collectionVolume.collection = collection;
    collectionVolume.floor1h = Number(response.floor1h);
    collectionVolume.floor24h = Number(response.floor24h);
    collectionVolume.floor7d = Number(response.floor7d);
    collectionVolume.marketCap = Number(response.marketCap);
    collectionVolume.symbol = collection.symbol;
    collectionVolume.volume1h = Number(response.volume1h);
    collectionVolume.volume24h = Number(response.volume24h);
    collectionVolume.volume7d = Number(response.volume7d);
    collectionVolume.floorPrice = Number(response.floorPrice);
    collectionVolume.numMints = Number(response.numMints.toFixed(0));
    return collectionVolume;
  }
}
