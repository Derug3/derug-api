import { AbstractRepository } from 'typeorm';
import { Collection } from '../entity/collection.entity';
import { CollectionRepository } from './collection.reposity';

export class PgRepository
  extends AbstractRepository<Collection>
  implements CollectionRepository
{
  saveCollectionBatch(collections: Collection[]): void {
    this.repository.save(collections);
  }
  getFlaggedCollections(page: number): Promise<Collection[]> {
    return this.repository.find({
      skip: (page - 1) * LIMIT_PER_PAGE,
      take: LIMIT_PER_PAGE,
    });
  }
}

export const LIMIT_PER_PAGE = 20;
