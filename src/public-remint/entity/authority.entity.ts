import { Column, PrimaryColumn } from 'typeorm';

export class Authority {
  @PrimaryColumn()
  pubkey: string;

  @Column()
  secretKey: string;

  @Column()
  derugData: string;
}
