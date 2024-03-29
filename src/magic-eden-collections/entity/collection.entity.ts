import { CollectionVolume } from 'src/collection-volume/entity/collection-volume.entity';
import { Column, Entity, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { CollectionActivities } from './collection-activities.entity';

@Entity()
export class Collection {
  @PrimaryColumn()
  symbol: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  discord: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'simple-array', nullable: true })
  categories: string[];

  @Column()
  isFlagged: boolean;

  @OneToMany(() => CollectionActivities, (activities) => activities.collection)
  activities: CollectionActivities[];

  @OneToOne(
    () => CollectionVolume,
    (collectionVolume) => collectionVolume.collection,
  )
  collectionStats: CollectionVolume;
}
