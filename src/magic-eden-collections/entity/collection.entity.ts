import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Collection {
  @PrimaryColumn()
  symbol: string;

  @Column()
  image: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  twitter: string;

  @Column({ nullable: true })
  discord: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'simple-array', nullable: true })
  categories: string[];

  @Column()
  isFlagged: boolean;
}
