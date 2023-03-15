import { CollectionRepository } from '../repository/collection.reposity';

export class GetRandomCollections {
  constructor(private readonly collectionsRepo: CollectionRepository) {}

  execute() {
    try {
      return this.collectionsRepo.getRandomCollections();
    } catch (error) {
      throw error;
    }
  }
}
