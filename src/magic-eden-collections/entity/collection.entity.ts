import { CollectionVolume } from 'src/collection-volume/entity/collection-volume.entity';
import { CollectionStats } from 'src/tensor/entities/stats.entity';
import { NftTrait } from 'src/tensor/entities/traits.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CollectionActivities } from './collection-activities.entity';

@Entity()
export class Collection {
  @PrimaryColumn()
  symbol: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  tensorSlug: string;

  @Column({ nullable: true })
  name: string;

  @Column({ default: false })
  hasActiveDerug: boolean;

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

  @OneToMany(() => NftTrait, (trait) => trait.collection, {
    eager: true,
    nullable: true,
    cascade: ['insert'],
  })
  traits: NftTrait[];

  @OneToOne(() => CollectionStats)
  stats: CollectionStats;
}
