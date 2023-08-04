import { Collection } from 'src/magic-eden-collections/entity/collection.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ListingSource } from '../dto/tensor.dto';

@Entity()
export class CollectionListing {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'float' })
  price: number;
  @Column()
  owner: string;
  @Column()
  mint: string;
  @Column({ type: 'enum', enum: ListingSource })
  soruce: ListingSource;
  @Column({ nullable: true })
  imageUrl: string;
  @Column({ type: 'bigint' })
  txAt: number;
  @Column()
  name: string;
  @ManyToOne(() => Collection)
  collection: Collection;
}
