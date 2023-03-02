import { Module } from '@nestjs/common';
import { MagicEdenCollectionsService } from './magic-eden-collections.service';
import { MagicEdenCollectionsController } from './magic-eden-collections.controller';
import { CollectionRepository } from './repository/collection.reposity';
import { PgRepository } from './repository/pg.repository';
import { Connection } from 'typeorm';

@Module({
  controllers: [MagicEdenCollectionsController],
  providers: [
    MagicEdenCollectionsService,
    {
      provide: CollectionRepository,
      useFactory: (conn: Connection) => conn.getCustomRepository(PgRepository),
      inject: [Connection],
    },
  ],
})
export class MagicEdenCollectionsModule {}
