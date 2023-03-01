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

  @Column({ array: true })
  categories: string[];

  @Column()
  isFlagged: boolean;
}
