import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Collection {
  @PrimaryColumn()
  symbol: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  twitter: string;

  @Column()
  discord: string;

  @Column()
  website: string;

  @Column({ type: 'simple-array' })
  categories: string[];

  @Column()
  isFlagged: boolean;
}
