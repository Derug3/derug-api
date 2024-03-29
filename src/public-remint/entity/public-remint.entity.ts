import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class PublicRemint {
  @PrimaryColumn()
  nftMetadata: string;

  @Column()
  derugData: string;

  @Column()
  hasReminted: boolean;

  @Column({ nullable: true })
  dateReminted: Date;

  @Column({ nullable: true })
  remintAuthority: string;

  @Column()
  name: string;

  @Column()
  uri: string;

  @Column()
  creator: string;

  @Column()
  newName: string;

  @Column()
  newSymbol: string;

  @Column()
  newUri: string;
}
