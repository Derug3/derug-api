import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
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

  @Exclude()
  @Column()
  accessToken: string;
}
