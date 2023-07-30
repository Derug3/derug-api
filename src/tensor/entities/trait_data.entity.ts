import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { NftTrait } from './traits.entity';

@Entity()
export class TraitData {
  @PrimaryGeneratedColumn('uuid')
  traitId: string;
  @Column()
  name: string;
  @Column()
  image: string;
  @Column()
  percentage: number;
  @ManyToOne(() => NftTrait, (nftTrait) => nftTrait.traits)
  trait: NftTrait;
}
