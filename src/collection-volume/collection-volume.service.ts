import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MagicEdenCollectionsService } from 'src/magic-eden-collections/magic-eden-collections.service';
import { CollectionVolumeFilter } from './entity/collection-volume.entity';
import { CollectionVolumeRepository } from './repository/collection-volume.repository';
import { GetCollectionVolumePagination } from './so/get-collection-volume-pagination';
import { GetTopVolume } from './so/get-top-volume.so';
import { SaveCollectionVolume } from './so/save-collection-volume.so';

@Injectable()
export class CollectionVolumeService {
  private saveCollectionVolume: SaveCollectionVolume;
  private getTopCollections: GetTopVolume;
  private getCollectionsPagination: GetCollectionVolumePagination;

  constructor(
    private readonly collectionVolumeRepo: CollectionVolumeRepository,
    collectionsSerivce: MagicEdenCollectionsService,
  ) {
    this.saveCollectionVolume = new SaveCollectionVolume(
      collectionVolumeRepo,
      collectionsSerivce,
    );
    this.getCollectionsPagination = new GetCollectionVolumePagination(
      collectionVolumeRepo,
    );
    this.getTopCollections = new GetTopVolume(collectionVolumeRepo);
  }

  // @Cron(CronExpression.EVERY_10_HOURS)
  storeCollectionVolume() {
    this.saveCollectionVolume.execute();
  }

  getTopCollectionsByVolume() {
    return this.getTopCollections.execute();
  }

  getCollectionsWithVolumePagination(pageNumber: number) {
    return this.getCollectionsPagination.execute(pageNumber);
  }

  getWithFilter(filter: CollectionVolumeFilter) {
    return this.collectionVolumeRepo.getWithFilter(filter);
  }
}
