import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MagicEdenCollectionsService } from 'src/magic-eden-collections/magic-eden-collections.service';
import { Repository } from 'typeorm';
import { NftTrait, TraitData } from './entities/traits.entity';
import {
  getFloorPrice,
  getListings,
  getTraits,
  recentActivities,
} from './so/tensor.graphql';
import { v4 } from 'uuid';

import { Cron } from '@nestjs/schedule';
import { NftTraitRepository } from './nft_trait.repository';
@Injectable()
export class TensorService {
  constructor(
    @Inject(forwardRef(() => MagicEdenCollectionsService))
    private readonly collectionService: MagicEdenCollectionsService,
    @InjectRepository(NftTraitRepository)
    private readonly traitsRepo: NftTraitRepository,
  ) {}
  logger = new Logger(TensorService.name);
  getFloorPriceTensor(slug: string) {
    return getFloorPrice(slug);
  }

  @Cron('* * * * *')
  async getTraitsTensor(slug: string) {
    const allSlugs = await this.collectionService.getAllCollectionsSlugs();
    const traits = await this.traitsRepo.fetchTraitsWithCollections();

    const storedTraits = traits.map((s) => s.collection.symbol);

    const filteredSlugs = allSlugs
      .filter((s) => !storedTraits.includes(s.symbol))
      .slice(0, 10);
    const newTraits: NftTrait[] = [];
    this.logger.log(`Starting cron for tensor traits`);
    await Promise.all(
      filteredSlugs.map(async (fs) => {
        try {
          const data = await getTraits(fs.symbol);
          if (data) {
            await this.collectionService.updateTensorSlug(
              slug,
              data.tensorSlug,
            );
            data.traits.forEach((t) => {
              const nftTrait = new NftTrait();
              nftTrait.name = t.name;
              nftTrait.collection = fs;
              nftTrait.nftTraitId = v4();

              const traits: TraitData[] = t.values.map((t) => ({
                image: t.image,
                name: t.name,
                percentage: Number(t.percentage),
                traitId: v4(),
              }));
              nftTrait.traits = traits;
              newTraits.push(nftTrait);
            });
          } else {
            const nftTrait = new NftTrait();
            nftTrait.nftTraitId = v4();
            nftTrait.collection = fs;
            nftTrait.traits = [];
            nftTrait.name = data.tensorSlug;
            newTraits.push(nftTrait);
          }
        } catch (error) {
          const nftTrait = new NftTrait();
          nftTrait.nftTraitId = v4();
          nftTrait.collection = fs;
          nftTrait.traits = [];
          nftTrait.name = '';
          newTraits.push(nftTrait);
        }
      }),
    );
    this.logger.log(
      `Finished cron for nft traits.Storing ${newTraits.length} traits in DB!`,
    );

    await this.traitsRepo.save(newTraits);
  }

  getTensorListings(slug: string) {
    return getListings(slug);
  }

  getTensorRecentActivities(slug: string) {
    return recentActivities(slug);
  }
}
