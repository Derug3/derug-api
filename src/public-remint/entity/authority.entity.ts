import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Authority {
  @PrimaryColumn()
  derugData: string;

  @Column()
  secretKey: string;

  @Column()
  pubkey: string;

  @Column()
  firstCreator: string;

  @Column()
  firstCreatorSecretKey: string;
}
