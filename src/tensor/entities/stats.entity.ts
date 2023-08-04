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
  @Column()
  numListed: number;
  @Column()
  numMints: number;
  @Column({ type: 'float' })
  royalty: number;
  @Column({ type: 'float' })
  fp: number;
  @Column({ type: 'bigint' })
  firstListed: number;
  @Column()
  symbol: string;
  //   @OneToOne(() => Collection, (collection) => collection.stats)
  //   collection: Collection;
}
