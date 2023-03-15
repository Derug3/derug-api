import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from './collection.entity';

@Entity()
export class CollectionActivities {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  seller: string;

  @Column()
  price: string;

  @Column()
  listedAt: number;

  @Column()
  mint: string;

  @ManyToOne(() => Collection, (collection) => collection.activities)
  collection: Collection;
}
