import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserDiscordData {
  @PrimaryColumn()
  pubkey: string;

  @Column()  
  discordId;

  @Column()
  username;

  @Column()
  discriminator;

  @Column()
  avatar;
}
