import { CollectionRepository } from '../repository/collection.reposity';

export class GetSingleCollection {
  constructor(private readonly collectionRepo: CollectionRepository) {}

  execute(slug) {
    return this.collectionRepo.getBySlug(slug);
  }
}
