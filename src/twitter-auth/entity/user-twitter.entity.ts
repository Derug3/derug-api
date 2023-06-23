import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
@Entity()
export class UserTwitterData {
  @PrimaryColumn()
  pubkey: string;

  @Column({ nullable: true })
  twitterName: string;

  @Column()
  code?: string;

  @Column()
  codeVerifier?: string;

  @Column({ nullable: true })
  twitterHandle: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({ default: false })
  verified: boolean;

  @Exclude()
  @Column({ nullable: true })
  accessToken: string;
}
