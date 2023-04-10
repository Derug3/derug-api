import { CollectionActivities } from 'src/magic-eden-collections/entity/collection-activities.entity';
import { AbstractRepository, EntityRepository } from 'typeorm';
import { CollectionActivitiesRepository } from './activities.repository';

@EntityRepository(CollectionActivities)
export class PgRepositoryActivities
  extends AbstractRepository<CollectionActivities>
  implements CollectionActivitiesRepository
{
  saveActivities(activities: CollectionActivities[]): void {
    this.repository.save(activities);
  }
}
