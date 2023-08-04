import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CollectionListing } from '../entities/listing.entity';

@Injectable()
export class ListingRepository extends Repository<CollectionListing> {
  constructor(private readonly dataSource: DataSource) {
    super(CollectionListing, dataSource.createEntityManager());
  }

  async saveStats(collectionListing: CollectionListing) {
    await this.save(collectionListing);
  }
}
