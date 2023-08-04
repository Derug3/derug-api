import { Collection } from 'src/magic-eden-collections/entity/collection.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CollectionStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  marketCap: number;
  @Column()
  volume24H: number;
  @Column()
  numListed: number;
  @Column()
  numMints: number;
  @Column()
  royalty: number;
  @Column()
  fp: number;
  @Column()
  firstListed: number;
  @OneToOne(() => Collection)
  collection: Collection;
}
