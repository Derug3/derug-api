import { AbstractRepository, EntityRepository } from 'typeorm';
import { CollectionActivities } from '../entity/collection-activities.entity';
import { Collection } from '../entity/collection.entity';
import { CollectionRepository } from './collection.reposity';
@EntityRepository(Collection)
export class PgRepository
  extends AbstractRepository<Collection>
  implements CollectionRepository
{
  async getAllCollections(): Promise<Collection[]> {
    return await this.repository.find({ select: ['symbol'] });
  }
  getActivities(slug: string): Promise<Collection> {
    return this.createQueryBuilder('collection')
      .select('collection.slug')
      .where('collection.slug:=slug', { slug })
      .leftJoin('collection,activities', 'activities')
      .getOne();
  }
  getByName(name: string): Promise<Collection[]> {
    return this.repository
      .createQueryBuilder('collection')
      .select()
      .where('collection.name like :name', {
        name: `${name.toLocaleLowerCase()}%`,
      })
      .orWhere('collection.symbol like :name', {
        name: `${name.toLocaleLowerCase()}%`,
      })
      .getMany();
  }
  getRandomCollections(): Promise<Collection[]> {
    return this.createQueryBuilder('randomCollections')
      .select()
      .orderBy('RANDOM()')
      .limit(50)
      .getMany();
  }
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
