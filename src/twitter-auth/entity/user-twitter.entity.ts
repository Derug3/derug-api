import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserTwitterData {
  @PrimaryColumn()
  pubkey: string;

  @Column()
  twitterName: string;

  @Column()
  twitterHandle: string;

  @Column()
  image: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  verified: boolean;

  @Column()
  accessToken: string;
}
