import { Collection } from 'src/magic-eden-collections/entity/collection.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CollectionStats {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  marketCap: string;
  @Column({ nullable: true })
  volume24H: string;
  @Column({ nullable: true })
  numListed: number;
  @Column({ nullable: true })
  numMints: number;
  @Column({ type: 'float', nullable: true })
  royalty: number;
  @Column({ type: 'float', nullable: true })
  fp: number;
  @Column({ type: 'bigint', nullable: true })
  firstListed: number;
  @Column()
  symbol: string;
  //   @OneToOne(() => Collection, (collection) => collection.stats)
  //   collection: Collection;
}
