import { AbstractRepository, EntityRepository } from 'typeorm';
import { CollectionActivities } from '../entity/collection-activities.entity';
import { Collection } from '../entity/collection.entity';
import { CollectionRepository } from './collection.reposity';
@EntityRepository(Collection)
export class PgRepository
  extends AbstractRepository<Collection>
  implements CollectionRepository
{
  async initCollectionDerug(symbol: string): Promise<boolean> {
    await this.repository.update({ symbol }, { hasActiveDerug: true });
    return true;
  }
  getAllCollectionsData(): Promise<Collection[]> {
    return this.repository.find();
  }
  async updateTensorSlug(slug: string, tensorSlug: string): Promise<boolean> {
    const response = await this.repository.update(
      { symbol: slug },
      { tensorSlug },
    );

    return response.affected === 1;
  }
  getBySlug(slug: string): Promise<Collection> {
    return this.createQueryBuilder('collection')
      .leftJoinAndSelect('collection.traits', 'traits')
      .where('collection.symbol=:slug', { slug })
      .getOne();
  }
  async getAllCollections(): Promise<Collection[]> {
    return await this.repository.find();
  }
  getActivities(slug: string): Promise<Collection> {
    return this.createQueryBuilder('collection')
      .select('collection.slug')
      .where('collection.slug:=slug', { slug })
      .leftJoin('collection,activities', 'activities')
      .getOne();
  }
  async getByName(name: string): Promise<Collection[]> {
    const resp = await this.repository
      .createQueryBuilder('collection')
      .select()
      .where('LOWER(collection.name) like :name', {
        name: `%${name}%`,
      })
      .orWhere('LOWER(collection.symbol) like :name', {
        name: `${name}%`,
      })
      .getMany();

    return resp;
  }
  getRandomCollections(symbols: string[]): Promise<Collection[]> {
    return this.createQueryBuilder('randomCollections')
      .select()
      .where('randomCollections.symbol IN (:...symbols)', { symbols })
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
