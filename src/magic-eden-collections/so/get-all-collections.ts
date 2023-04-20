import { CollectionRepository } from '../repository/collection.reposity';

export class GetAllCollections {
  constructor(private readonly collectionsRepo: CollectionRepository) {}

  execute() {
    return this.collectionsRepo.getAllCollections();
  }
}
