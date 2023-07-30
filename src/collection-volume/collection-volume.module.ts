import { Module } from '@nestjs/common';
import { CollectionVolumeService } from './collection-volume.service';
import { CollectionVolumeController } from './collection-volume.controller';
import { MagicEdenCollectionsService } from 'src/magic-eden-collections/magic-eden-collections.service';
import { CollectionVolumeRepository } from './repository/collection-volume.repository';
import { PgCollectionVolume } from './repository/collection-volume.pg.repository';
import { Connection } from 'typeorm';
import { CollectionRepository } from 'src/magic-eden-collections/repository/collection.reposity';
import { PgRepository } from 'src/magic-eden-collections/repository/pg.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { TensorModule } from 'src/tensor/tensor.module';

@Module({
  imports: [ScheduleModule.forRoot(),TensorModule],
  controllers: [CollectionVolumeController],
  providers: [
    CollectionVolumeService,
    MagicEdenCollectionsService,
    {
      provide: CollectionVolumeRepository,
      useFactory: (conn: Connection) =>
        conn.getCustomRepository(PgCollectionVolume),
      inject: [Connection],
    },
    {
      provide: CollectionRepository,
      useFactory: (conn: Connection) => conn.getCustomRepository(PgRepository),
      inject: [Connection],
    },
  ],
})
export class CollectionVolumeModule {}
