import {
  CollectionVolume,
  CollectionVolumeFilter,
} from '../entity/collection-volume.entity';

export abstract class CollectionVolumeRepository {
  abstract saveCollectionVolume(
    collectionVolume: CollectionVolume[],
  ): Promise<CollectionVolume[]>;
  abstract getTopCollectionsByVolume(): Promise<CollectionVolume[]>;
  abstract getCollectionsByVolume(
    pageNumber: number,
  ): Promise<CollectionVolume[]>;

  abstract getWithFilter(
    filter: CollectionVolumeFilter,
  ): Promise<CollectionVolume[]>;
}
