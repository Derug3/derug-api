import {
  COLLECTIONS_PER_PAGE,
  TOP_VOLUME_COLLECTIONS_COUNT,
} from 'src/utilities/constants';
import { AbstractRepository, EntityRepository, MoreThan } from 'typeorm';
import {
  CollectionVolume,
  CollectionVolumeFilter,
} from '../entity/collection-volume.entity';
import { CollectionVolumeRepository } from './collection-volume.repository';

@EntityRepository(CollectionVolume)
export class PgCollectionVolume
  extends AbstractRepository<CollectionVolume>
  implements CollectionVolumeRepository
{
  getWithFilter(filter: CollectionVolumeFilter): Promise<CollectionVolume[]> {
    return this.createQueryBuilder('collectionVolume')
      .select()
      .orderBy(`collectionVolume.${filter}`, 'DESC')
      .skip(0)
      .take(TOP_VOLUME_COLLECTIONS_COUNT)
      .leftJoinAndSelect('collectionVolume.collection', 'collection')
      .getMany();
  }
  saveCollectionVolume(
    collectionVolume: CollectionVolume[],
  ): Promise<CollectionVolume[]> {
    return this.repository.save(collectionVolume);
  }
  getTopCollectionsByVolume(): Promise<CollectionVolume[]> {
    return this.repository.find({
      order: { marketCap: { direction: 'DESC' } },
      where: { numMints: MoreThan(100) },
      take: TOP_VOLUME_COLLECTIONS_COUNT,
    });
  }
  getCollectionsByVolume(pageNumber: number): Promise<CollectionVolume[]> {
    return this.repository.find({
      skip: (pageNumber - 1) * COLLECTIONS_PER_PAGE,
      take: COLLECTIONS_PER_PAGE,
    });
  }
}
