import { NotFoundError } from 'rxjs';
import { CollectionRepository } from '../repository/collection.reposity';

export class GetFlaggedCollections {
  constructor(private readonly collectionRepository: CollectionRepository) {}

  execute(page: number) {
    try {
      return this.collectionRepository.getFlaggedCollections(page);
    } catch (error) {
      throw new NotFoundError(error.message);
    }
  }
}
