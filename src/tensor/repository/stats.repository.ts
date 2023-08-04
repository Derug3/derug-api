import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CollectionStats } from '../entities/stats.entity';

@Injectable()
export class StatsRepository extends Repository<CollectionStats> {
  constructor(private readonly dataSource: DataSource) {
    super(CollectionStats, dataSource.createEntityManager());
  }

  async saveStats(collectionStats: CollectionStats) {
    await this.save(collectionStats);
  }
}
