import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserMint {
  @PrimaryColumn()
  userPubkey: string;

  @PrimaryColumn()
  candyMachine: string;

  @Column()
  mintedCount: number;
}
