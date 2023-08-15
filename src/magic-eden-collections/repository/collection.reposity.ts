import { CollectionActivities } from '../entity/collection-activities.entity';
import { Collection } from '../entity/collection.entity';

export abstract class CollectionRepository {
  abstract saveCollectionBatch(collections: Collection[]): void;
  abstract getFlaggedCollections(page: number): Promise<Collection[]>;
  abstract getRandomCollections(symbols: string[]): Promise<Collection[]>;
  abstract getByName(name: string): Promise<Collection[]>;
  abstract getActivities(slug: string): Promise<Collection>;
  abstract getAllCollections(): Promise<Collection[]>;
  abstract getBySlug(slug: string): Promise<Collection>;
  abstract updateTensorSlug(slug: string, tensorSlug: string): Promise<boolean>;
  abstract getAllCollectionsData(): Promise<Collection[]>;
  abstract initCollectionDerug(symbol: string): Promise<boolean>;
}
