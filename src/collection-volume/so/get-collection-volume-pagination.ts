import { CollectionVolume } from '../entity/collection-volume.entity';
import { CollectionVolumeRepository } from '../repository/collection-volume.repository';

export class GetCollectionVolumePagination {
  constructor(
    private readonly collectionVolumeRepo: CollectionVolumeRepository,
  ) {}

  execute(pageNumber: number) {
    try {
      return this.collectionVolumeRepo.getCollectionsByVolume(pageNumber);
    } catch (error) {
      throw error;
    }
  }
}
