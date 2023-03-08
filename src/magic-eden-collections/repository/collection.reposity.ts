import { CollectionActivities } from '../entity/collection-activities.entity';
import { Collection } from '../entity/collection.entity';

export abstract class CollectionRepository {
  abstract saveCollectionBatch(collections: Collection[]): void;
  abstract getFlaggedCollections(page: number): Promise<Collection[]>;
  abstract getRandomCollections(): Promise<Collection[]>;
  abstract getByName(name: string): Promise<Collection[]>;
  abstract getActivities(slug: string): Promise<Collection>;
  abstract getAllCollections(): Promise<Collection[]>;
}
