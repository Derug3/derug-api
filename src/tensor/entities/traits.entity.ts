import { Collection } from 'src/magic-eden-collections/entity/collection.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TraitData } from './trait_data.entity';

@Entity()
export class NftTrait {
  @PrimaryGeneratedColumn('uuid')
  nftTraitId: string;
  @Column()
  name: string;
  @ManyToOne(() => TraitData, (traitData) => traitData.trait, { eager: true })
  traits: TraitData[];
  @ManyToOne(() => Collection, (collection) => collection.traits, {
    eager: true,
  })
  collection: Collection;
}
