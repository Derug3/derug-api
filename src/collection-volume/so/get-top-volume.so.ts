import { CollectionRepository } from 'src/magic-eden-collections/repository/collection.reposity';
import { CollectionVolumeRepository } from '../repository/collection-volume.repository';

export class GetTopVolume {
  constructor(private readonly collectionRepo: CollectionVolumeRepository) {}

  execute() {
    try {
      return this.collectionRepo.getTopCollectionsByVolume();
    } catch (error) {
      throw error;
    }
  }
}
