import { Module } from '@nestjs/common';
import { MagicEdenCollectionsService } from './magic-eden-collections.service';
import { MagicEdenCollectionsController } from './magic-eden-collections.controller';
import { CollectionRepository } from './repository/collection.reposity';
import { PgRepository } from './repository/pg.repository';
import { Connection } from 'typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { CollectionActivitiesRepository } from './repository/activities/activities.repository';
import { PgRepositoryActivities } from './repository/activities/pg.repository';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [MagicEdenCollectionsController],
  providers: [
    MagicEdenCollectionsService,
    {
      provide: CollectionRepository,
      useFactory: (conn: Connection) => conn.getCustomRepository(PgRepository),
      inject: [Connection],
    },
    {
      provide: CollectionActivitiesRepository,
      useFactory: (conn: Connection) =>
        conn.getCustomRepository(PgRepositoryActivities),
      inject: [Connection],
    },
  ],
})
export class MagicEdenCollectionsModule {}
