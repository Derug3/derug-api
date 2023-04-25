import { Collection } from 'src/magic-eden-collections/entity/collection.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class CollectionVolume {
  @PrimaryColumn()
  symbol: string;

  @Column({ type: 'numeric', precision: 10, scale: 4 })
  numMints: number;

  @Column({ nullable: true, type: 'numeric', precision: 10, scale: 4 })
  marketCap: number;

  @Column({ nullable: true, type: 'numeric', precision: 10, scale: 4 })
  floorPrice: number;

  @Column({ nullable: true, type: 'numeric', precision: 10, scale: 4 })
  volume1h: number;

  @Column({ nullable: true, type: 'numeric', precision: 10, scale: 4 })
  volume24h: number;

  @Column({ nullable: true, type: 'numeric', precision: 10, scale: 4 })
  volume7d: number;

  @Column({ nullable: true, type: 'numeric', precision: 10, scale: 4 })
  floor1h: number;

  @Column({ nullable: true, type: 'numeric', precision: 10, scale: 4 })
  floor24h: number;

  @Column({ nullable: true, type: 'numeric', precision: 10, scale: 4 })
  floor7d: number;

  @OneToOne(() => Collection, (collection) => collection.collectionStats, {
    eager: true,
  })
  @JoinColumn()
  collection: Collection;
}

export enum CollectionVolumeFilter {
  MarketCap = 'marketCap',
  NumMints = 'numMints',
  FloorPrice = 'floorPrice',
}
