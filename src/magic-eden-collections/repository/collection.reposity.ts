import { Collection } from '../entity/collection.entity';

export abstract class CollectionRepository {
  abstract saveCollectionBatch(collections: Collection[]): void;
  abstract getFlaggedCollections(page: number): Promise<Collection[]>;
}
