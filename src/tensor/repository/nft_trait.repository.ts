import { Injectable } from '@nestjs/common';
import { Collection } from 'src/magic-eden-collections/entity/collection.entity';
import { DataSource, Repository } from 'typeorm';
import { NftTrait } from '../entities/traits.entity';

@Injectable()
export class NftTraitRepository extends Repository<NftTrait> {
  constructor(dataSource: DataSource) {
    super(NftTrait, dataSource.createEntityManager());
  }

  fetchTraitsWithCollections() {
    return this.createQueryBuilder('traits')
      .leftJoinAndSelect('traits.collection', 'collection')
      .getMany();
  }
}
