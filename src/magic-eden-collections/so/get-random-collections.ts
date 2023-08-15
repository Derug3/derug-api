import { CollectionStats } from 'src/tensor/entities/stats.entity';
import { TensorService } from 'src/tensor/tensor.service';
import { Collection } from '../entity/collection.entity';
import { CollectionRepository } from '../repository/collection.reposity';

export class GetRandomCollections {
  constructor(
    private readonly collectionsRepo: CollectionRepository,
    private readonly tensorService: TensorService,
  ) {}

  async execute() {
    try {
      const slugs = await this.tensorService.getSlugs();
      const collections = await this.collectionsRepo.getRandomCollections(
        slugs.map((s) => s.symbol),
      );
      const collectionData: {
        collection: Collection;
        stats?: CollectionStats;
      }[] = [];
      collections.forEach((c) => {
        collectionData.push({
          collection: c,
          stats: slugs.find((s) => s.symbol === c.symbol),
        });
      });
      return collectionData;
    } catch (error) {
      throw error;
    }
  }
}
