import { CollectionActivities } from 'src/magic-eden-collections/entity/collection-activities.entity';

export abstract class CollectionActivitiesRepository {
  abstract saveActivities(activities: CollectionActivities[]): void;
}
