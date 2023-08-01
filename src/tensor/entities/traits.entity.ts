import { Collection } from 'src/magic-eden-collections/entity/collection.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class NftTrait {
  @PrimaryGeneratedColumn('uuid')
  nftTraitId: string;
  @Column()
  name: string;
  @Column({ type: 'jsonb' })
  traits: TraitData[];
  @ManyToOne(() => Collection, (collection) => collection.traits)
  collection: Collection;
}

export class TraitData {
  traitId: string;
  name: string;
  image: string;
  percentage: number;
}
